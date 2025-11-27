import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  subLabel?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, max, color = "bg-derby-green", subLabel }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Determine color based on health status if default green
  let finalColor = color;
  if (color === "bg-derby-green") {
    if (percentage < 20) finalColor = "bg-red-500";
    else if (percentage < 50) finalColor = "bg-yellow-400";
    else finalColor = "bg-derby-green";
  }

  return (
    <div className="mb-3 w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">{subLabel ? subLabel : `${Math.floor(value)}/${max}`}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ease-out ${finalColor}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;