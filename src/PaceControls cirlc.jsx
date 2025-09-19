// PaceControls.jsx
import React, { useEffect, useMemo } from "react";

export default function PaceControls({
  distance, setDistance, customDistance, setCustomDistance,
  circle, setCircle,
  targetTime, setTargetTime,
  targetPaceMin, setTargetPaceMin,
  targetPaceSec, setTargetPaceSec,
  mode, setMode
}) {
  // Базовые метры для пресетов (в метрах)
  const baseMeters = [
    100, 200, 400, 600, 800, 1000, 1200, 1600, 1800, 2000,
    3000, 5000, 10000, 21097, 42195
  ];

  // Оригинальные подписи (чтобы при circle === 400 вернуть прежний текст)
  const originalLabelsMap = {
    100: "100 м - 1/4 круга",
    200: "200 м - 1/2 круга",
    400: "400 м - круг",
    600: "600 м - 1.5 круга",
    800: "800 м - 2 круга",
    1000: "1 км - 2.5 круга",
    1200: "1200 м - 3 круга",
    1600: "1600 м - 1 миля, 4 круга",
    1800: "1800 м - 4.2 круга",
    2000: "2000 м - 5 кругов",
    3000: "3000 м - 7.5 кругов",
    5000: "5 км - 12.5 круга",
    10000: "10 км - 25 кругов",
    21097: "Полумарафон 21.1 км ~52.75 круга",
    42195: "Марафон 42.195 км ~105.5 круга",
  };

  // Генерация presets динамически в зависимости от circle.
  // Не меняем JSX после return — только тут пересчитываем подписи/значения.
  const presets = useMemo(() => {
    // защитимся от нулевой/неправильной длины круга
    const c = (typeof circle === "number" && circle > 0) ? circle : 400;

    return baseMeters.map((m) => {
      const kmValue = +(m / 1000).toFixed(3); // значение в км
      let label = "";

      // Если пользователь оставил стандартный круг 400 м — вернуть оригинальные тексты (без изменений)
      if (c === 400 && originalLabelsMap[m]) {
        label = originalLabelsMap[m];
      } else {
        // Для нестандартного круга — показываем метр/км и примерное количество кругов
        const laps = m / c;
        if (m >= 1000) {
          // для >=1км выводим в км с одной или тремя цифрами, как нужно
          label = `${(m / 1000).toFixed(m % 1000 === 0 ? 0 : 3)} км - ~${laps.toFixed(2)} круга`;
        } else {
          label = `${m} м - ~${laps.toFixed(2)} круга`;
        }
      }

      return { label, value: kmValue };
    });
  }, [circle]);

  // Для режима времени — разбор targetTime на часы, минуты, секунды
  const parseTargetTime = () => {
    const parts = (targetTime || "").split(":").map((p) => parseInt(p) || 0);
    if (parts.length === 3) return { h: parts[0], m: parts[1], s: parts[2] };
    if (parts.length === 2) return { h: 0, m: parts[0], s: parts[1] };
    return { h: 0, m: 0, s: parts[0] || 0 };
  };

  const timeParts = parseTargetTime();

  const updateTime = (h, m, s) => {
    setTargetTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
  };

  useEffect(() => {
    // оставил хук, если захочешь подцепить побочные эффекты при смене круга
  }, [circle]);

  return (
    <div className="space-y-4 mt-1 mb-1">
      {/* Дистанция */}
      
      <div className="bg-gray-50 shadow-md rounded-lg p-2 space-y-2">
        <label className="font-semibold text-gray-400">Выбор дистанции:</label>
        <span className="text-lime-600 flex text-[11px] p-0">*круг {circle} метров - в работе возможность выбора длины круга</span>
        <div className="flex gap-2">
          <div className="w-1/2">
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
          <div className="w-1/2">
            <select
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-gray-400"
              value={Math.floor(circle)}
              onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setCircle(val);
            }}
            >
          {Array.from({ length: 351 }, (_, i) => i + 50).map((val) => (
            <option key={val} value={val}>
            длина круга - {val} метров
            </option>
          ))}
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
