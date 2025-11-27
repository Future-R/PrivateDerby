import React, { useState, useEffect } from 'react';
import { 
  GameState, 
  GameMode, 
  Action, 
  LogEntry,
  LocationId,
  Subject
} from './types';
import { 
  INITIAL_STATS, 
  INITIAL_ACADEMICS, 
  LOCATIONS, 
  DAILY_SCHEDULE 
} from './constants';
import { 
  formatTime, 
  getMinutesFromMidnight,
  getGameDate
} from './utils';

// Layout Components
import StatsPanel from './components/StatsPanel';
import LogPanel from './components/LogPanel';
import ActionPanel from './components/ActionPanel';
import CharacterSheet from './components/CharacterSheet';
import { Clock } from 'lucide-react';

const App: React.FC = () => {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>({
    time: { day: 1, hour: 6, minute: 30, weekday: 1 }, // Starts Monday 6:30
    location: 'dorm',
    mode: GameMode.FREE_ROAM,
    attributes: { ...INITIAL_STATS },
    academics: { ...INITIAL_ACADEMICS },
    money: 1000,
    wearingUniform: false,
    logs: [],
    classTurn: 1
  });

  const [showCharacterSheet, setShowCharacterSheet] = useState(false);

  const currentLocationData = LOCATIONS[gameState.location];

  // Helper to add log
  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    setGameState(prev => ({
      ...prev,
      logs: [
        ...prev.logs,
        {
          id: Math.random().toString(36).substr(2, 9),
          text,
          type,
          timestamp: formatTime(prev.time).split(' ')[1] // Just HH:MM
        }
      ]
    }));
  };

  // --- ENGINE: TIME & ATTRIBUTES ---

  const advanceTime = (minutes: number) => {
    setGameState(prev => {
      let newMinute = prev.time.minute + minutes;
      let newHour = prev.time.hour;
      let newDay = prev.time.day;
      let newWeekday = prev.time.weekday;

      while (newMinute >= 60) {
        newMinute -= 60;
        newHour += 1;
      }

      while (newHour >= 24) {
        newHour -= 24;
        newDay += 1;
        newWeekday = (newWeekday + 1) % 7;
      }

      // Mood decay logic: Closer to 50 over time
      let newMood = prev.attributes.mood;
      // Mood tends to 50. Simplified: Just nudge it 1 point towards 50 every 30 mins
      if (minutes >= 30) {
          if (newMood > 50) newMood = Math.max(50, newMood - 1);
          if (newMood < 50) newMood = Math.min(50, newMood + 1);
      }

      return {
        ...prev,
        time: { day: newDay, hour: newHour, minute: newMinute, weekday: newWeekday },
        attributes: {
            ...prev.attributes,
            mood: newMood
        }
      };
    });
  };

  // --- ACTIONS GENERATOR ---

  const getAvailableActions = (): Action[] => {
    const actions: Action[] = [];
    const { location, mode, time, wearingUniform, attributes, classTurn } = gameState;
    const currentMinutes = getMinutesFromMidnight(time);

    // --- CLASS MODE ACTIONS ---
    if (mode === GameMode.CLASS) {
      actions.push(
        {
          id: 'class_listen',
          label: '认真听讲',
          costMinutes: 10,
          variant: 'primary',
          execute: (state) => {
            const subject = state.currentClassSubject!;
            const success = Math.random() > 0.1; // 90% success
            addLog(`你认真听了${subject}课。`, 'info');
            
            const xpGain = success ? 5 : 2;
            const newState = { ...state };
            newState.academics[subject].exp += xpGain;
            newState.attributes.energy = Math.max(0, state.attributes.energy - 5);
            
            if (Math.random() < 0.2) {
                addLog('老师突然和你有了眼神接触！声望微升。', 'event');
            }
            return newState;
          }
        },
        {
          id: 'class_talk',
          label: '讲悄悄话',
          costMinutes: 10,
          variant: 'secondary',
          execute: (state) => {
             addLog('你和同桌聊起了昨天的比赛。', 'info');
             return {
                 attributes: {
                     ...state.attributes,
                     mood: Math.min(100, state.attributes.mood + 3),
                     spirit: Math.max(0, state.attributes.spirit - 2)
                 }
             };
          }
        },
        {
          id: 'class_sleep',
          label: '睡觉',
          costMinutes: 10,
          variant: 'neutral',
          execute: (state) => {
             addLog('Zzz... 你在课堂上睡着了。', 'warning');
             return {
                 attributes: {
                     ...state.attributes,
                     energy: Math.min(state.attributes.maxEnergy, state.attributes.energy + 5),
                     spirit: Math.min(state.attributes.maxSpirit, state.attributes.spirit + 5)
                 }
             };
          }
        }
      );
      return actions;
    }

    // --- FREE ROAM ACTIONS ---

    // 1. Move Actions (Driven by LOCATIONS config)
    const currentLocData = LOCATIONS[location];
    if (currentLocData && currentLocData.connections) {
       Object.entries(currentLocData.connections).forEach(([targetId, cost]) => {
           const targetLoc = LOCATIONS[targetId];
           if (!targetLoc) return;

           const costNum = Number(cost);

           actions.push({
               id: `move_to_${targetId}`,
               label: `前往：${targetLoc.name}`,
               costMinutes: costNum,
               execute: () => {
                   addLog(`你前往了${targetLoc.name}。`, 'info');
                   return { location: targetId as LocationId };
               }
           });
       });
    }

    // 2. Location Specific Actions
    
    if (location === 'dorm') {
        actions.push({
            id: 'sleep',
            label: '睡觉 (直到明天)',
            costMinutes: 0, 
            variant: 'primary',
            condition: () => time.hour >= 20 || time.hour < 5,
            execute: (state) => {
                let minsToSleep = 0;
                if (time.hour >= 20) {
                   minsToSleep = ((24 - time.hour) * 60 - time.minute) + (6 * 60);
                } else {
                   minsToSleep = (6 * 60) - (time.hour * 60 + time.minute);
                }
                addLog('你钻进被窝，结束了这一天。', 'success');
                addLog('---- 第二天 ----', 'event');
                return {
                    attributes: {
                        ...state.attributes,
                        energy: state.attributes.maxEnergy,
                        spirit: state.attributes.maxSpirit,
                        health: Math.min(state.attributes.maxHealth, state.attributes.health + 10)
                    },
                }; 
            }
        });
        
        if (!wearingUniform) {
            actions.push({
                id: 'wear_uniform',
                label: '换校服',
                costMinutes: 5,
                execute: () => {
                    addLog('你换上了特雷森学园的校服。', 'success');
                    return { wearingUniform: true };
                }
            });
        }

        // Dorm Self Study
        Object.values(Subject).forEach(subject => {
            actions.push({
                id: `dorm_study_${subject}`,
                label: `自习：${subject}`,
                costMinutes: 30,
                condition: () => attributes.spirit >= 15,
                execute: (state) => {
                    addLog(`你在宿舍简单复习了${subject}。效率一般。`, 'info');
                    const newState = { ...state };
                    newState.academics[subject].exp += 2; // Low EXP gain
                    newState.attributes.spirit -= 10;
                    return newState;
                }
            });
        });
    }

    if (location === 'bathroom') {
        actions.push({
            id: 'shower',
            label: '洗澡',
            costMinutes: 30,
            variant: 'primary',
            condition: () => attributes.energy >= 5,
            execute: (state) => {
                addLog('洗了个舒服的热水澡，神清气爽！', 'success');
                return {
                    attributes: {
                        ...state.attributes,
                        mood: Math.min(100, state.attributes.mood + 15),
                        health: Math.min(state.attributes.maxHealth, state.attributes.health + 5),
                        energy: state.attributes.energy - 5
                    }
                };
            }
        });
    }

    if (location === 'cafeteria') {
        actions.push({
            id: 'eat_lunch',
            label: '点一份胡萝卜汉堡',
            costMinutes: 20,
            variant: 'primary',
            condition: () => attributes.energy < attributes.maxEnergy,
            execute: (state) => {
                const cost = 50;
                if (state.money < cost) {
                    addLog('钱不够...', 'error');
                    return {};
                }
                addLog('美味的汉堡！体力回复了。', 'success');
                return {
                    money: state.money - cost,
                    attributes: {
                        ...state.attributes,
                        energy: Math.min(state.attributes.maxEnergy, state.attributes.energy + 30)
                    }
                };
            }
        });
    }
    
    if (location === 'training_field') {
         // Afternoon Group Training (14:00 - 17:00)
         if (currentMinutes >= 840 && currentMinutes < 1020) {
             actions.push({
                id: 'train_group',
                label: '参加团体训练',
                costMinutes: 60,
                variant: 'primary',
                condition: () => attributes.energy >= 30,
                execute: (state) => {
                    addLog('你跟随教官进行了严格的团体训练。全属性提升！', 'success');
                    return {
                        attributes: {
                            ...state.attributes,
                            speed: state.attributes.speed + 2,
                            stamina: state.attributes.stamina + 2,
                            power: state.attributes.power + 2,
                            guts: state.attributes.guts + 2,
                            intelligence: state.attributes.intelligence + 1,
                            energy: state.attributes.energy - 30
                        }
                    };
                }
            });
         }

         actions.push({
            id: 'train_speed',
            label: '自主速度训练',
            costMinutes: 30,
            variant: 'secondary',
            condition: () => attributes.energy >= 15,
            execute: (state) => {
                addLog('你在跑道上挥洒汗水。速度+2', 'success');
                return {
                    attributes: {
                        ...state.attributes,
                        speed: state.attributes.speed + 2,
                        energy: state.attributes.energy - 15
                    }
                };
            }
        });
    }

    if (location === 'library') {
        // Library Study Actions (High Efficiency)
        Object.values(Subject).forEach(subject => {
            actions.push({
                id: `lib_study_${subject}`,
                label: `自习：${subject}`,
                costMinutes: 30,
                variant: 'secondary',
                condition: () => attributes.spirit >= 10,
                execute: (state) => {
                    addLog(`你在图书馆专心研读了${subject}。`, 'info');
                    const newState = { ...state };
                    newState.academics[subject].exp += 5; // High EXP gain
                    newState.attributes.intelligence += 1;
                    newState.attributes.spirit -= 10;
                    return newState;
                }
            });
        });
    }
    
    // Generic Classroom self-study (legacy check, maybe remove if library is better, but keeping as fallback)
    if (location === 'classroom') {
        if (currentMinutes < 540 || currentMinutes > 1020) { 
             Object.values(Subject).forEach(subject => {
                actions.push({
                    id: `class_study_${subject}`,
                    label: `自习：${subject}`,
                    costMinutes: 30,
                    condition: () => attributes.spirit >= 10,
                    execute: (state) => {
                        addLog(`你在教室复习了${subject}。`, 'info');
                         const newState = { ...state };
                         newState.academics[subject].exp += 4; 
                         newState.attributes.intelligence += 0.5;
                         newState.attributes.spirit -= 10;
                         return newState;
                    }
                });
             });
        }
    }

    return actions;
  };

  // --- MAIN LOOP / ACTION HANDLER ---

  const handleAction = (action: Action) => {
    // 1. Calculate Costs & Effects
    const stateUpdates = action.execute(gameState) || {};
    
    // 2. Special Case: Sleep (Time Jump)
    let timeCost = action.costMinutes;
    if (action.id === 'sleep') {
        const { hour, minute } = gameState.time;
        if (hour >= 20) {
             timeCost = ((24 - hour) * 60 - minute) + (6 * 60);
        } else {
             timeCost = (6 * 60) - (hour * 60 + minute);
        }
    }

    // 3. Update State
    setGameState(prev => ({
      ...prev,
      ...stateUpdates
    }));

    // 4. Advance Time
    advanceTime(timeCost as number);
    
    // 5. Check Class Turn logic
    if (gameState.mode === GameMode.CLASS) {
        setGameState(prev => {
            if (prev.classTurn >= 5) {
                // End Class
                addLog(`下课铃响了。`, 'event');
                return {
                    ...prev,
                    mode: GameMode.FREE_ROAM,
                    classTurn: 1,
                    currentClassSubject: undefined,
                };
            } else {
                return {
                    ...prev,
                    classTurn: prev.classTurn + 1
                };
            }
        });
    }
  };

  // --- EVENT LISTENER (SCHEDULE) ---
  useEffect(() => {
    const currentMins = getMinutesFromMidnight(gameState.time);
    
    // 1. Check Class Schedule
    if (gameState.time.weekday >= 1 && gameState.time.weekday <= 5) { // Weekdays
        const currentClass = DAILY_SCHEDULE.find(s => currentMins >= s.start && currentMins < s.end);
        
        if (currentClass) {
            if (gameState.location === 'classroom' && gameState.mode !== GameMode.CLASS) {
                addLog(`上课时间到了：${currentClass.subject}`, 'event');
                setGameState(prev => ({
                    ...prev,
                    mode: GameMode.CLASS,
                    currentClassSubject: currentClass.subject,
                    classTurn: 1
                }));
            } else if (gameState.location !== 'classroom' && gameState.mode !== GameMode.CLASS) {
                 if (currentMins === currentClass.start + 5) {
                     addLog('你迟到了！快去教室！', 'error');
                 }
            }
        }
    }
    
    // 2. Check 22:00 Curfew
    if (gameState.time.hour === 22 && gameState.time.minute === 0) {
        addLog('门禁时间到了。宿舍和校门即将关闭。', 'warning');
    }

  }, [gameState.time, gameState.location]);


  // --- RENDER ---
  const bgImage = currentLocationData?.backgroundImage || '';

  return (
    <div className="relative w-screen h-screen overflow-hidden text-slate-800 font-sans">
      
      {/* Background Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ 
            backgroundImage: bgImage ? `url("${bgImage}")` : 'none',
            backgroundColor: '#f8fafc'
        }}
      />
      {/* Overlay for readability if image is present */}
      {bgImage && <div className="absolute inset-0 z-0 bg-white/60 backdrop-blur-[2px]" />}

      {/* Modal Layer */}
      {showCharacterSheet && (
          <CharacterSheet 
            attributes={gameState.attributes} 
            academics={gameState.academics} 
            onClose={() => setShowCharacterSheet(false)} 
          />
      )}

      {/* Main Container */}
      <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto w-full bg-slate-50/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
          
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-derby-green/20 p-5 shadow-sm flex justify-between items-center z-20">
            <div className="flex items-center gap-4">
                <div className="bg-derby-green text-white p-3 rounded-xl font-black text-xl shadow-sm">
                    PD
                </div>
                <div>
                    <h1 className="font-black text-2xl text-gray-800 leading-tight">私密马赛 <span className="text-derby-green">PrivateDerby</span></h1>
                </div>
            </div>
            
            <div className="flex items-center gap-8">
                <div className="text-right">
                    <div className="text-3xl font-mono font-bold text-gray-700 flex items-center gap-3">
                        <Clock size={28} className="text-derby-green" />
                        {formatTime(gameState.time)}
                    </div>
                    <div className="text-base font-medium text-gray-500">{getGameDate(gameState.time.day)}</div>
                </div>
            </div>
        </header>

        {/* Main Content Grid */}
        <main className="flex-1 overflow-hidden p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                
                {/* Left: Stats (3 cols) */}
                <div className="md:col-span-3 h-full overflow-hidden flex flex-col">
                    <StatsPanel 
                        attributes={gameState.attributes} 
                        money={gameState.money}
                        onShowDetails={() => setShowCharacterSheet(true)}
                    />
                </div>

                {/* Center: Log (5 cols) */}
                <div className="md:col-span-6 h-full flex flex-col overflow-hidden">
                    <LogPanel logs={gameState.logs} />
                </div>

                {/* Right: Actions (4 cols) */}
                <div className="md:col-span-3 h-full overflow-hidden flex flex-col">
                    <ActionPanel 
                        actions={getAvailableActions()} 
                        gameState={gameState} 
                        onActionClick={handleAction} 
                    />
                </div>
            
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;