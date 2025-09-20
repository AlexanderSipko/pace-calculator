import React, { useRef, useEffect, useState } from "react";
import PaceControls from "./PaceControls";
import { parseTime, formatTime, calculateSplits, calculateIntervals } from "./utils";
import PaceVariationsTable from "./PaceVariationsTable";
import TargetInfo from "./TargetInfo";
import Stopwatch from "./Stopwatch";

export default function PacePlanner() {
  let local_store_suffix = import.meta.env.VITE_MODE
  local_store_suffix = local_store_suffix === undefined ? '_dev' : local_store_suffix
  const local_store_key = "distce_pace_time" + local_store_suffix;

  // --- Загружаем сохранённое состояние из localStorage
  const saved = JSON.parse(localStorage.getItem(local_store_key) || "{}");

  const [time, setTime] = useState(0); // миллисекунды
  const [distance, setDistance] = useState(saved.distance ?? 0.8);
  const [customDistance, setCustomDistance] = useState(saved.customDistance ?? 0.8);
  const [circle, setCircle] = useState(saved.circle ?? 400);
  const [targetTime, setTargetTime] = useState(saved.targetTime ?? "00:01:00");
  const [targetPaceMin, setTargetPaceMin] = useState(saved.targetPaceMin ?? 4);
  const [targetPaceSec, setTargetPaceSec] = useState(saved.targetPaceSec ?? 40);
  const [mode, setMode] = useState(saved.mode ?? "pace");

  const tableRef = useRef(null);

  // --- Сохраняем в localStorage при изменении ключевых параметров
  useEffect(() => {
    const data = {
      distance,
      customDistance,
      circle,
      targetTime,
      targetPaceMin,
      targetPaceSec,
      mode,
    };
    localStorage.setItem(local_store_key, JSON.stringify(data));
  }, [distance, customDistance, circle, targetTime, targetPaceMin, targetPaceSec, mode]);

  // helper: корректно присвоить мин/сек из секунд
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

  // --- СИНХРОНИЗАЦИЯ: режим "pace"
  useEffect(() => {
    if (mode !== "pace") return;
    if (!isFinite(distance) || distance <= 0) {
      setTargetTime("00:00:00");
      return;
    }
    const paceSec = targetPaceMin * 60 + targetPaceSec;
    const totalSec = paceSec * distance;
    setTargetTime(formatTime(totalSec, "round"));
  }, [mode, targetPaceMin, targetPaceSec, distance]);

  // --- СИНХРОНИЗАЦИЯ: режим "time"
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
  }, [mode, targetTime, distance]);

  // --- Расчёты
  const totalSeconds = parseTime(targetTime);
  const avgPacePerKm = distance > 0 ? totalSeconds / distance : 0;
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
    </div>
  );
}
