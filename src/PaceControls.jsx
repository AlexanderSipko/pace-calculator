// PaceControls.jsx
import React, { useEffect } from "react";
import { presets } from './utils'

export default function PaceControls({
  distance, setDistance, customDistance, setCustomDistance,
  targetTime, setTargetTime,
  targetPaceMin, setTargetPaceMin,
  targetPaceSec, setTargetPaceSec,
  mode, setMode
}) {

  // Для режима времени — разбор targetTime на часы, минуты, секунды
  const parseTargetTime = () => {
    const parts = targetTime.split(":").map((p) => parseInt(p) || 0);
    if (parts.length === 3) return { h: parts[0], m: parts[1], s: parts[2] };
    if (parts.length === 2) return { h: 0, m: parts[0], s: parts[1] };
    return { h: 0, m: 0, s: parts[0] || 0 };
  };

  const timeParts = parseTargetTime();

  const updateTime = (h, m, s) => {
    setTargetTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
  };


  // useEffect(() => {

  // }, [circle])

  return (
    <div className="space-y-4 relative mt-0 mb-0 p-0">
      {/* Дистанция */}
      <div className="flex gap-4 absolute top-0 right-1 justify-center items-center mb-0">
        <img src="./icons8-run-32.png" alt="Описание" className="w-4 h-4 opacity-80" />
        <h1 className="
          text-1xl font-semibold text-center m-0 p-0 flex justify-center
          bg-gradient-to-r from-purple-300 via-purple-500 to-purple-600 bg-clip-text text-transparent
        ">расчет темпа 
          <span className="text-gray-300 ml-2 text-[10px]">{import.meta.env.VITE_MODE}</span>
        </h1>
      </div>
      <div className="
        bg-gray-50 shadow-md rounded-lg px-2 pb-2 space-y-2 mb-1
        ">
        <label className="
          font-semibold bg-gradient-to-r from-gray-400 to-gray-400
          via-gray-400 bg-clip-text text-transparent">дистанция:</label>
        {/* <span className="text-lime-600 flex text-[11px] p-0">*круг {circle} метров</span> */}
        <div className="flex gap-2 justify-center items-center">
          <div className="w-full">
            <select
              className="border border-gray-300 rounded-md p-2 w-full
              focus:border-gray-300
              focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setDistance(parseFloat(e.target.value))}
              value={distance}
            >
              {presets.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
              ))}
              <option value={customDistance}>Свободный ввод</option>
            </select>
          </div>
          <div className="p-0 m-0 flex justify-end">
              <button
              onClick={() => (setCustomDistance(0), setDistance(0))}
              className={`px-2 py-2 rounded-md font-medium bg-red-200 hover:bg-red-400 text-white  text-gray-900"}`}
              >очистить</button>
            </div>
        </div>
       

        {distance === customDistance && (
          <div className="flex flex-col justify-center">
            <div className="flex gap-2 mt-2">
            {/* Целые км */}
            <select
              className="border border-gray-300 rounded-md p-2 w-1/2 focus:ring-2 focus:ring-gray-400"
              value={Math.floor(customDistance)}
              onChange={(e) => {
                const whole = parseInt(e.target.value, 10);
                const fraction = customDistance - Math.floor(customDistance);
                const val = whole + fraction;
                setCustomDistance(val);
                setDistance(val);
              }}
            >
              {Array.from({ length: 151 }, (_, i) => (
                <option key={i} value={i}>{i} км</option>
              ))}
            </select>
            
          
            {/* Метры */}
            <select
              className="border border-gray-300 rounded-md p-2 w-1/2 focus:ring-2 focus:ring-gray-400"
              value={Math.round((customDistance - Math.floor(customDistance)) * 1000)}
              onChange={(e) => {
                const meters = parseInt(e.target.value, 10);
                const whole = Math.floor(customDistance);
                const val = whole + meters / 1000;
                setCustomDistance(val);
                setDistance(val);
              }}
            >
              {Array.from({ length: 1001 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>{m} м</option>
              ))}
            </select>
            </div>
            
          </div>
        )}
      </div>

      {/* Цель */}
      <div className="bg-gray-50 shadow-md rounded-lg p-2 space-y-2">
        {/* <label className="font-semibold text-green-800">Цель:</label> */}
        <div className="flex gap-1 mb-1 justify-around">
          <button
            onClick={() => setMode("time")}
            className={`
            px-2 py-1 rounded-md font-medium w-1/2
            ${mode === "time" ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-900"}`}
          >По времени</button>
          <button
            onClick={() => setMode("pace")}
            className={`
            px-2 py-1 rounded-md font-medium w-1/2
            ${mode === "pace" ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-900"}`}
          >По темпу</button>
        </div>



        {mode === "time" ? (
          <div className="flex gap-1">
            <select
              value={timeParts.h}
              onChange={(e) => updateTime(parseInt(e.target.value), timeParts.m, timeParts.s)}
              className="border border-gray-300 rounded-md p-2 w-1/3 focus:ring-2 focus:ring-gray-400"
            >
              {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{i} ч</option>)}
            </select>
            <select
              value={timeParts.m}
              onChange={(e) => updateTime(timeParts.h, parseInt(e.target.value), timeParts.s)}
              className="border border-gray-300 rounded-md p-2 w-1/3 focus:ring-2 focus:ring-gray-400"
            >
              {Array.from({ length: 60 }, (_, i) => <option key={i} value={i}>{i} мин</option>)}
            </select>
            <select
              value={timeParts.s}
              onChange={(e) => updateTime(timeParts.h, timeParts.m, parseInt(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-1/3 focus:ring-2 focus:ring-gray-400"
            >
              {Array.from({ length: 60 }, (_, i) => <option key={i} value={i}>{i} сек</option>)}
            </select>
          </div>
        ) : (
          <div className="flex gap-1">
            <select
              value={targetPaceMin}
              onChange={(e) => setTargetPaceMin(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-1/2 focus:ring-2 focus:ring-gray-400"
            >
              {Array.from({ length: 60 }, (_, i) => <option key={i} value={i}>{i} мин</option>)}
            </select>
            <select
              value={targetPaceSec}
              onChange={(e) => setTargetPaceSec(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-1/2 focus:ring-2 focus:ring-gray-400"
            >
              {Array.from({ length: 60 }, (_, i) => <option key={i} value={i}>{i} сек</option>)}
            </select>
          </div>
        )}
      </div>

    </div>
  );
}
