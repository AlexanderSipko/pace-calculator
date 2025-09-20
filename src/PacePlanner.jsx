// PacePlanner.jsx
import React, { useRef, useEffect, useState } from "react";
import PaceControls from "./PaceControls";
import { parseTime, formatTime, calculateSplits, calculateIntervals } from "./utils";
import PaceVariationsTable from "./PaceVariationsTable";
import TargetInfo from "./TargetInfo";
import Stopwatch from "./Stopwatch";


export default function PacePlanner() {
  const [time, setTime] = useState(0); // миллисекунды
  const [distance, setDistance] = React.useState(0.8); // пример: 200 м
  const [customDistance, setCustomDistance] = React.useState(0.8);
  const [circle, setCircle] = React.useState(400); // пример: 400 м
  // всегда храним targetTime как строку "hh:mm:ss"
  const [targetTime, setTargetTime] = React.useState("00:01:00");

  // темп (min / sec) — управляющие селекты
  const [targetPaceMin, setTargetPaceMin] = React.useState(4);
  const [targetPaceSec, setTargetPaceSec] = React.useState(40);

  const [mode, setMode] = React.useState("pace"); // "time" | "pace"

  const tableRef = useRef(null);

  // helper: корректно присвоить мин/сек из секунд (обрабатывает округление 60 -> +1min)
  const setPaceFromSeconds = (paceSec) => {
    if (!isFinite(paceSec) || paceSec <= 0) {
      setTargetPaceMin(0);
      setTargetPaceSec(0);
      return;
    }
    let mins = Math.floor(paceSec / 60);
    let secs = Math.round(paceSec % 60);
    if (secs === 60) {
      mins += 1;
      secs = 0;
    }
    setTargetPaceMin(mins);
    setTargetPaceSec(secs);
  };

  // --- СИНХРОНИЗАЦИЯ: если режим === "pace", то при изменении темпа или дистанции считаем время
  useEffect(() => {
    if (mode !== "pace") return;
    if (!isFinite(distance) || distance <= 0) {
      setTargetTime("00:00:00");
      return;
    }
    const paceSec = targetPaceMin * 60 + targetPaceSec;
    const totalSec = paceSec * distance;
    setTargetTime(formatTime(totalSec, "round"));
    // зависимость: при изменении targetPaceMin/targetPaceSec/distance/mode пересчитываем время
  }, [mode, targetPaceMin, targetPaceSec, distance]);

  // --- СИНХРОНИЗАЦИЯ: если режим === "time", то при изменении времени или дистанции считаем темп
  useEffect(() => {
    if (mode !== "time") return;
    if (!isFinite(distance) || distance <= 0) {
      setTargetPaceMin(0);
      setTargetPaceSec(0);
      return;
    }
    const totalSec = parseTime(targetTime);
    const pacePerKm = totalSec / distance;
    setPaceFromSeconds(pacePerKm);
    // зависимость: при изменении targetTime/distance/mode пересчитываем темп
  }, [mode, targetTime, distance]);

  // Используем targetTime как единый источник правды для totalSeconds (после синхронизации эффекты обеспечат его актуальность)
  const totalSeconds = parseTime(targetTime);

  // Средний темп (сек/км)
  const avgPacePerKm = (distance > 0) ? totalSeconds / distance : 0;

  // Сегменты и интервалы (равномерный темп)
  const splits = calculateSplits(distance, totalSeconds);
  const intervals = calculateIntervals(avgPacePerKm, [0.1, 0.2, 0.4]);

  const handlePrintTable = () => {
    if (!tableRef.current) return;
    const printHtml = `
      <html>
        <head>
          <title>Таблица</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            body { font-family: Arial, Helvetica, sans-serif; color:#073; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #4c9f4c; padding: 8px; text-align: center; }
            thead { background: #e6f4ea; }
            tfoot { background: #e6f4ea; font-weight: bold; }
          </style>
        </head>
        <body>
          ${tableRef.current.innerHTML}
        </body>
      </html>
    `;
    const w = window.open("", "_blank");
    w.document.write(printHtml);
    w.document.close();
    w.focus();
    w.print();
  };


  return (
    <div className="max-w-3xl mx-auto p-1 space-y-6 text-gray-900 mt-1 mb-1">

      <PaceControls
        distance={distance} setDistance={setDistance}
        customDistance={customDistance} setCustomDistance={setCustomDistance}
        circle={circle} setCircle={setCircle}
        targetTime={targetTime} setTargetTime={setTargetTime}
        targetPaceMin={targetPaceMin} setTargetPaceMin={setTargetPaceMin}
        targetPaceSec={targetPaceSec} setTargetPaceSec={setTargetPaceSec}
        mode={mode} setMode={setMode}
      />

      <div ref={tableRef} className="mt-2 mb-1">
        <TargetInfo avgPacePerKm={avgPacePerKm} totalSeconds={totalSeconds} distance={distance} />
        <div className="mt-4">
        <Stopwatch time={time} setTime={setTime} />
      </div>
        <PaceVariationsTable basePaceSec={avgPacePerKm} distance={distance} time={time} />
      </div>

      {/* <div className="text-center mt-2">
        <button
          onClick={handlePrintTable}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700"
        >
          Печать таблицы
        </button>
      </div> */}
    </div>
  );
}
