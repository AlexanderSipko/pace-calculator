// TargetInfo.jsx
import React from "react";
import { formatTime, tempFormat } from "./utils";


export default function TargetInfo({ avgPacePerKm, totalSeconds, distance, mode }) {
  return (
    <div className="bg-gray-100 shadow-md rounded-lg px-2 py-2 space-y-2">
      <div className="flex justify-center p-1 m-0">
        <p className="text-red-400 items-center p-0 text-[12px] m-0">
          {mode === 'time' && 'Для точного планирования используйте "Расчет по темпу"'}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="text-gray-600 border-2 border-gray-600 bg-[#9EE539] rounded-sm shadow-sm px-1">
          Темп:
          <strong className="text-gray-800 px-1">{tempFormat(avgPacePerKm)}</strong>
        </div>
        <div className="text-gray-600 border-2 border-gray-600 bg-[#9EE539] rounded-sm shadow-sm px-1">
          Время:
          <strong className="text-gray-800 px-1">{formatTime(totalSeconds)}</strong>
        </div>
        <div className="text-gray-400">
          <strong className="text-gray-500 px-1">{distance}</strong> км
        </div>
      </div>
      
      
    </div>
  );
}
