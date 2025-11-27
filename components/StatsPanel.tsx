import React from 'react';
import { Attributes } from '../types';
import ProgressBar from './ProgressBar';
import { User } from 'lucide-react';

interface StatsPanelProps {
  attributes: Attributes;
  money: number;
  onShowDetails: () => void;
}

const getStatusDescription = (val: number, type: 'energy' | 'spirit' | 'health' | 'mood'): string => {
  const percentage = val; 
  
  if (type === 'energy') {
    if (percentage > 80) return "感觉有着使不完的劲！";
    if (percentage > 50) return "身体状况尚可。";
    if (percentage > 20) return "有点累了...";
    return "随时可能倒下...";
  }
  if (type === 'spirit') {
    if (percentage > 80) return "思维清晰，注意力集中。";
    if (percentage > 50) return "还可以坚持一会。";
    if (percentage > 20) return "脑袋昏昏沉沉的。";
    return "完全无法思考...";
  }
  if (type === 'health') {
    if (percentage > 90) return "无病无灾，非常健康。";
    if (percentage > 60) return "没什么大碍。";
    return "身体有些不适...";
  }
  if (type === 'mood') {
    if (percentage > 80) return "绝好调！心情非常愉快！";
    if (percentage > 60) return "心情不错。";
    if (percentage > 40) return "心情平平。";
    return "情绪低落...";
  }
  return "";
};

const StatsPanel: React.FC<StatsPanelProps> = ({ attributes, money, onShowDetails }) => {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-full pr-2">
      
      {/* Profile Card */}
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-derby-green/20 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-16 h-16 rounded-full bg-derby-green flex items-center justify-center text-white ring-4 ring-derby-light shadow-sm">
             <User size={32} />
          </div>
          <div>
            <div className="font-bold text-gray-800 text-xl">无名的马娘</div>
            <div className="text-base font-mono text-derby-green font-bold mt-1">{money} 元</div>
          </div>
        </div>
        <button 
          onClick={onShowDetails}
          className="w-full mt-2 text-sm bg-white/80 hover:bg-derby-green hover:text-white text-derby-green font-bold py-3 rounded border border-derby-green transition-all duration-200"
        >
          角色详情
        </button>
      </div>

      {/* Survival Stats - Vertical Layout */}
      <div className="bg-white/90 backdrop-blur-sm p-0 rounded-xl shadow-sm border border-derby-green/20 flex-1 flex flex-col overflow-hidden">
        <h3 className="bg-derby-green text-white font-black p-3 text-lg">生存状态</h3>
        
        <div className="p-4 flex flex-col gap-6 overflow-y-auto">
          <div>
             <ProgressBar label="体力" value={attributes.energy} max={attributes.maxEnergy} subLabel={`${Math.floor(attributes.energy)}/${attributes.maxEnergy}`} />
             <p className="text-sm text-gray-500 mt-1">
               {getStatusDescription(attributes.energy, 'energy')}
             </p>
          </div>

          <div>
             <ProgressBar label="精力" value={attributes.spirit} max={attributes.maxSpirit} color="bg-blue-400" subLabel={`${Math.floor(attributes.spirit)}/${attributes.maxSpirit}`} />
             <p className="text-sm text-gray-500 mt-1">
               {getStatusDescription(attributes.spirit, 'spirit')}
             </p>
          </div>

          <div>
             <ProgressBar label="健康" value={attributes.health} max={attributes.maxHealth} color="bg-rose-400" subLabel={`${Math.floor(attributes.health)}/${attributes.maxHealth}`} />
             <p className="text-sm text-gray-500 mt-1">
               {getStatusDescription(attributes.health, 'health')}
             </p>
          </div>

          <div>
             <ProgressBar label="心情" value={attributes.mood} max={100} color="bg-pink-400" subLabel={`${Math.floor(attributes.mood)}/100`} />
             <p className="text-sm text-gray-500 mt-1">
               {getStatusDescription(attributes.mood, 'mood')}
             </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StatsPanel;