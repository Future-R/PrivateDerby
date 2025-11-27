import React from 'react';
import { Attributes, AcademicStats, Subject } from '../types';
import { getGradeColor } from '../utils';
import { X, Trophy, BookOpen, Activity } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface CharacterSheetProps {
  attributes: Attributes;
  academics: AcademicStats;
  onClose: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ attributes, academics, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-md w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border-2 border-derby-green">
        
        {/* Header */}
        <div className="bg-derby-green text-white p-5 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Trophy size={28} />
            角色详情
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Stats */}
            <div className="space-y-8">
              {/* Competition Stats */}
              <div className="bg-white/80 p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="flex items-center gap-2 font-bold text-derby-green text-xl mb-6 pb-2 border-b-2 border-gray-100">
                  <Activity size={24} />
                  竞赛属性
                </h3>
                <div className="space-y-5">
                  <ProgressBar label="速度" value={attributes.speed} max={1200} color="bg-blue-500" subLabel={attributes.speed.toString()} />
                  <ProgressBar label="耐力" value={attributes.stamina} max={1200} color="bg-orange-500" subLabel={attributes.stamina.toString()} />
                  <ProgressBar label="力量" value={attributes.power} max={1200} color="bg-red-500" subLabel={attributes.power.toString()} />
                  <ProgressBar label="意志" value={attributes.guts} max={1200} color="bg-pink-500" subLabel={attributes.guts.toString()} />
                  <ProgressBar label="智力" value={attributes.intelligence} max={1200} color="bg-emerald-500" subLabel={attributes.intelligence.toString()} />
                </div>
              </div>

              {/* Survival Stats Detail */}
              <div className="bg-white/80 p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="flex items-center gap-2 font-bold text-gray-700 text-xl mb-6 pb-2 border-b-2 border-gray-100">
                  <Activity size={24} />
                  身体状况
                </h3>
                <div className="grid grid-cols-2 gap-5 text-base">
                   <div className="bg-slate-50/80 p-4 rounded-lg border border-gray-100">
                      <div className="text-gray-500 font-medium">体力上限</div>
                      <div className="font-mono font-bold text-2xl text-gray-800">{attributes.maxEnergy}</div>
                   </div>
                   <div className="bg-slate-50/80 p-4 rounded-lg border border-gray-100">
                      <div className="text-gray-500 font-medium">精力上限</div>
                      <div className="font-mono font-bold text-2xl text-gray-800">{attributes.maxSpirit}</div>
                   </div>
                   <div className="bg-slate-50/80 p-4 rounded-lg border border-gray-100">
                      <div className="text-gray-500 font-medium">体质 (决定健康)</div>
                      <div className="font-mono font-bold text-2xl text-gray-800">{attributes.maxHealth}</div>
                   </div>
                   <div className="bg-slate-50/80 p-4 rounded-lg border border-gray-100">
                      <div className="text-gray-500 font-medium">体重</div>
                      <div className="font-mono font-bold text-2xl text-gray-800">46kg</div>
                      <div className="text-sm font-bold text-green-600 mt-1">完美</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Right Column: Academics */}
            <div className="bg-white/80 p-6 rounded-xl shadow-sm border border-gray-100 h-full">
              <h3 className="flex items-center gap-2 font-bold text-purple-700 text-xl mb-6 pb-2 border-b-2 border-gray-100">
                <BookOpen size={24} />
                文化课成绩
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {Object.values(Subject).map((subject) => {
                  const data = academics[subject];
                  return (
                    <div key={subject} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors border border-gray-100">
                      <span className="font-bold text-gray-700 text-lg">{subject}</span>
                      <div className="flex items-center gap-6">
                        <div className="text-sm text-gray-500 font-mono w-20 text-right font-medium">
                           经验: {data.exp}
                        </div>
                        <div className={`font-mono font-bold text-2xl w-10 text-center ${getGradeColor(data.level)}`}>
                          {data.level}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 text-sm text-gray-500 p-5 bg-slate-50/80 rounded-lg leading-relaxed border border-gray-100">
                <p>• 文化课成绩影响考试表现和部分事件触发概率。</p>
                <p className="mt-1">• 每天复习不足的科目经验值会少量衰退。</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;