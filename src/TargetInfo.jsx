// TargetInfo.jsx
import React from "react";
import { formatTime } from "./utils";


export default function TargetInfo({ avgPacePerKm, totalSeconds, distance }) {
  // Берём разряды для выбранной дистанции, если есть
//   const ranksMen = rankDataMen[distance] || [];
//   const ranksWomen = rankDataWomen[distance] || [];

  return (
    <div className="bg-gray-100 shadow-md rounded-lg p-2 space-y-2">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="text-gray-600 border-2 border-gray-600 bg-[#9EE539] rounded-sm shadow-sm px-1">
          Темп:
          <strong className="text-gray-800 px-1">{formatTime(avgPacePerKm, "floor")}</strong>
        </div>
        <div className="text-gray-600 border-2 border-gray-600 bg-[#9EE539] rounded-sm shadow-sm px-1">
          Время:
          <strong className="text-gray-800 px-1">{formatTime(totalSeconds, "round")}</strong>
        </div>
        <div className="text-gray-400">
          <strong className="text-gray-500 px-1">{distance}</strong> км
        </div>
        {/* {ranksMen && Object.entries(ranksMen).length > 0 && (
        <div className="text-gray-400 flex flex-wrap gap-1 justify-between">
            Разряды (М):
            {Object.entries(ranksMen).map(([rank, time], i) => (
                time && (
                    <span key={i} className="text-gray-400 px-1">
                    {rank}: {time}
                </span>
            )
            ))}
        </div>
        )}
        {ranksWomen && Object.entries(ranksWomen).length > 0 && (
        <div className="text-gray-400 flex flex-wrap gap-1 justify-between">
            Разряды (Ж):
            {Object.entries(ranksWomen).map(([rank, time], i) => (
                time && (
                    <span key={i} className="text-gray-400 px-1">
                    {rank}: {time}
                </span>
            )
            ))}
        </div>
        )} */}
      </div>
    </div>
  );
}
