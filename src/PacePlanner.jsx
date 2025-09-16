import React, { useState } from "react";

export default function PacePlanner() {
  const presets = [
    { label: "100 м", value: 0.1 },
    { label: "200 м", value: 0.2 },
    { label: "400 м", value: 0.4 },
    { label: "1 км", value: 1 },
    { label: "1200 м", value: 1.2 },
    { label: "1600 м (1 миля)", value: 1.6 },
    { label: "5 км", value: 5 },
    { label: "10 км", value: 10 },
    { label: "Полумарафон", value: 21.1 },
    { label: "Марафон", value: 42.2 },
  ];

  const [distance, setDistance] = useState(21.1);
  const [customDistance, setCustomDistance] = useState(21.1);
  const [targetTime, setTargetTime] = useState("01:45:00");
  const [targetPace, setTargetPace] = useState("05:00");
  const [mode, setMode] = useState("time"); // "time" | "pace"
  const [strategy, setStrategy] = useState("even");
  const [splitFactor, setSplitFactor] = useState(0); // seconds (0..30)

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(":").map((p) => Number(p || 0));
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return Number(parts[0]) || 0;
  };

  const formatTime = (secsRaw) => {
    const secs = Math.round(secsRaw);
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? String(h).padStart(2, "0") + ":" : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const totalSeconds = mode === "time" ? parseTime(targetTime) : parseTime(targetPace) * distance;
  const basePace = totalSeconds / Math.max(distance, 0.0001);

  const nKm = Math.ceil(distance);
  const denom = nKm > 1 ? nKm - 1 : 1;

  const splits = Array.from({ length: nKm }, (_, idx) => {
    const i = idx + 1;
    const t = (i - 1) / denom;
    let adj = 0;

    if (strategy === "negative") adj = (1 - 2 * t) * splitFactor;
    else if (strategy === "positive") adj = (2 * t - 1) * splitFactor;

    const paceSec = basePace + adj;
    const cumulativeSec = paceSec * i;

    return { km: i, pace: formatTime(Math.max(paceSec, 0)), cumulative: formatTime(Math.max(cumulativeSec, 0)) };
  });

  const intervalDistances = [0.1, 0.2, 0.4];
  const intervalResults = intervalDistances.map((d) => ({ dist: d, time: formatTime(basePace * d) }));

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center text-blue-600">Калькулятор целевого темпа</h1>

      {/* Дистанция */}
      <div className="bg-white shadow-md rounded-lg p-4 space-y-3">
        <label className="block font-semibold text-gray-700">Выбор дистанции:</label>
        <select
          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setDistance(parseFloat(e.target.value))}
          value={distance}
        >
          {presets.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
          <option value={customDistance}>Свободный ввод</option>
        </select>
        {distance === customDistance && (
          <input
            type="number"
            step="0.1"
            placeholder="Введите км"
            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring-2 focus:ring-blue-400"
            value={customDistance}
            onChange={(e) => { const val = parseFloat(e.target.value) || 0; setCustomDistance(val); setDistance(val); }}
          />
        )}
      </div>

      {/* Цель */}
      <div className="bg-white shadow-md rounded-lg p-4 space-y-3">
        <label className="block font-semibold text-gray-700">Цель:</label>
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => setMode("time")}
            className={`px-4 py-2 rounded-md font-medium ${mode === "time" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            По времени
          </button>
          <button
            onClick={() => setMode("pace")}
            className={`px-4 py-2 rounded-md font-medium ${mode === "pace" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            По темпу
          </button>
        </div>
        {mode === "time" ? (
          <input
            type="text"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
            placeholder="чч:мм:сс"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <input
            type="text"
            value={targetPace}
            onChange={(e) => setTargetPace(e.target.value)}
            placeholder="мм:сс"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400"
          />
        )}
      </div>

      {/* Стратегия */}
      <div className="bg-white shadow-md rounded-lg p-4 space-y-3">
        <label className="block font-semibold text-gray-700">Стратегия:</label>
        <select
          className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-400"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        >
          <option value="even">Равномерный</option>
          <option value="negative">Негативный сплит</option>
          <option value="positive">Позитивный сплит</option>
        </select>
        {(strategy === "negative" || strategy === "positive") && (
          <div className="mt-2">
            <label className="block text-sm text-gray-600">Разброс (сек/км): {splitFactor}</label>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={splitFactor}
              onChange={(e) => setSplitFactor(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Таблица км */}
      <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
        <h2 className="font-semibold text-gray-700 mb-2">Таблица по километрам:</h2>
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-center">Км</th>
              <th className="border p-2 text-center">Темп</th>
              <th className="border p-2 text-center">Общее время</th>
            </tr>
          </thead>
          <tbody>
            {splits.map((s) => (
              <tr key={s.km} className="even:bg-gray-50">
                <td className="border p-2 text-center">{s.km}</td>
                <td className="border p-2 text-center">{s.pace}</td>
                <td className="border p-2 text-center">{s.cumulative}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Интервалы */}
      <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
        <h2 className="font-semibold text-gray-700 mb-2">Интервалы:</h2>
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-center">Дистанция</th>
              <th className="border p-2 text-center">Время</th>
            </tr>
          </thead>
          <tbody>
            {intervalResults.map((r) => (
              <tr key={r.dist} className="even:bg-gray-50">
                <td className="border p-2 text-center">{r.dist * 1000} м</td>
                <td className="border p-2 text-center">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
