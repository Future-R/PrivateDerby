import React from 'react';
import { Action, GameState, GameMode } from '../types';
import { LOCATIONS } from '../constants';
import { Clock, MapPin } from 'lucide-react';

interface ActionPanelProps {
  actions: Action[];
  gameState: GameState;
  onActionClick: (action: Action) => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ actions, gameState, onActionClick }) => {
  
  // Filter available actions based on condition
  const availableActions = actions.filter(action => !action.condition || action.condition(gameState));

  const isClassMode = gameState.mode === GameMode.CLASS;
  const currentLocation = LOCATIONS[gameState.location];
  const locationName = currentLocation?.name || gameState.location;
  const locationDesc = currentLocation?.description || '';

  return (
    <div className="h-full flex flex-col bg-white/90 backdrop-blur-sm border border-derby-green/20 rounded-xl shadow-sm overflow-hidden">
        {/* Header Area */}
        <div className={`p-4 ${isClassMode ? 'bg-purple-600' : 'bg-derby-green'} text-white`}>
            {isClassMode ? (
                <div className="text-center">
                    <h2 className="font-black text-xl">正在上课: {gameState.currentClassSubject}</h2>
                    <div className="text-sm font-bold uppercase tracking-widest mt-1 opacity-90">
                        Turn {gameState.classTurn} / 5
                    </div>
                </div>
            ) : (
                <div>
                     <div className="flex items-center gap-2 mb-1">
                        <MapPin size={22} />
                        <span className="font-black text-xl">{locationName}</span>
                     </div>
                     <div className="text-sm opacity-90 pl-1 font-medium">
                         {locationDesc}
                     </div>
                </div>
            )}
        </div>

        {/* Action List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {availableActions.length === 0 ? (
                <div className="text-center text-gray-400 mt-10 text-base">没有可执行的行动</div>
            ) : (
                availableActions.map(action => (
                    <button
                        key={action.id}
                        onClick={() => onActionClick(action)}
                        className={`w-full group relative flex items-center justify-between p-4 rounded-lg border transition-all duration-200 text-left
                            ${
                                action.variant === 'danger' 
                                ? 'bg-white/80 border-red-200 hover:bg-red-600 hover:border-red-600 hover:text-white text-red-700' 
                                : action.variant === 'secondary'
                                ? 'bg-white/80 border-purple-200 hover:bg-purple-600 hover:border-purple-600 hover:text-white text-purple-700'
                                : 'bg-white/80 border-gray-200 hover:bg-derby-green hover:border-derby-green hover:text-white text-gray-700'
                            }
                        `}
                    >
                        <span className="font-bold text-base">{action.label}</span>
                        {action.costMinutes > 0 && (
                             <span className={`text-sm font-mono font-bold px-2 py-1 rounded flex items-center gap-1 transition-opacity
                                ${action.variant === 'danger' ? 'bg-red-50 text-red-700' : 
                                  action.variant === 'secondary' ? 'bg-purple-50 text-purple-700' :
                                  'bg-gray-100 text-gray-500 group-hover:bg-white/20 group-hover:text-white'}
                             `}>
                                <Clock size={14} />
                                {action.costMinutes}m
                             </span>
                        )}
                    </button>
                ))
            )}
        </div>
        
        {/* Helper Text */}
        <div className="p-3 text-center text-sm font-medium text-gray-400 border-t bg-gray-50/50">
            {isClassMode ? '请认真听讲...' : '选择一个行动...'}
        </div>
    </div>
  );
};

export default ActionPanel;