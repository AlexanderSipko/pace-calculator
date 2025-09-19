// PaceControls.jsx
import React, { useEffect } from "react";

export default function PaceControls({
  distance, setDistance, customDistance, setCustomDistance,
  circle, setCircle,
  targetTime, setTargetTime,
  targetPaceMin, setTargetPaceMin,
  targetPaceSec, setTargetPaceSec,
  mode, setMode
}) {
  const presets = [
    { label: "100 м - 1/4 круга", value: 0.1 },
    { label: "200 м - 1/2 круга", value: 0.2 },
    { label: "400 м - круг", value: 0.4 },
    { label: "600 м - 1.5 круга", value: 0.6 },
    { label: "800 м - 2 круга", value: 0.8 },
    { label: "1 км - 2.5 круга", value: 1 },
    { label: "1200 м - 3 круга", value: 1.2 },
    { label: "1600 м - 1 миля, 4 круга", value: 1.6 },
    { label: "1800 м - 4.2 круга", value: 1.8 },
    { label: "2000 м - 5 кругов", value: 2 },
    { label: "3000 м - 7.5 кругов", value: 3 },
    { label: "5 км - 12.5 круга", value: 5 },
    { label: "10 км - 25 кругов", value: 10 },
    { label: "Полумарафон 21.1 км ~52.75 круга", value: 21.097 },
    { label: "Марафон 42.195 км ~105.5 круга", value: 42.195 },
  ];

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


  useEffect(() => {

  }, [circle])

  return (
    <div className="space-y-4 mt-1 mb-1">
      {/* Дистанция */}
      
      <div className="bg-gray-50 shadow-md rounded-lg p-2 space-y-2">
        <label className="font-semibold text-gray-400">Выбор дистанции:</label>
        <span className="text-lime-600 flex text-[11px] p-0">*круг {circle} метров</span>
        <div className="flex gap-2 justify-center">
          <div className="w-full">
            <select
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setDistance(parseFloat(e.target.value))}
              value={distance}
            >
              {presets.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
              ))}
              <option value={customDistance}>Свободный ввод</option>
            </select>
          </div>
        </div>
       

        {distance === customDistance && (
          <>
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
            {Array.from({ length: 100 }, (_, i) => (
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
          </>
        )}
      </div>

      {/* Цель */}
      <div className="bg-gray-50 shadow-md rounded-lg p-2 space-y-2">
        {/* <label className="font-semibold text-green-800">Цель:</label> */}
        <div className="flex gap-1 mb-1 justify-around">
          <button
            onClick={() => setMode("time")}
            className={`px-2 py-1 rounded-md font-medium ${mode === "time" ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-900"}`}
          >По времени</button>
          <button
            onClick={() => setMode("pace")}
            className={`px-2 py-1 rounded-md font-medium ${mode === "pace" ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-900"}`}
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
