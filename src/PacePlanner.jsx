// PacePlanner.jsx
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
        <TargetInfo avgPacePerKm={avgPacePerKm} totalSeconds={totalSeconds} distance={distance} mode={mode} />
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
