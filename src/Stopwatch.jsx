import React, { useState, useEffect, useRef } from "react";
import {formatTimeStopWatch } from './utils'

export default function Stopwatch({time, setTime}) {
  const [isRunning, setIsRunning] = useState(false);

  const intervalsRef = useRef([]);
  const intervalRef = useRef(null);

  let local_store_suffix = import.meta.env.VITE_MODE
  local_store_suffix = local_store_suffix === undefined ? '_dev' : local_store_suffix
  const local_store_key = "stopwatch" + local_store_suffix


  useEffect(() => {
    
    const saved = JSON.parse(localStorage.getItem(local_store_key)) || [];
    intervalsRef.current = saved;
    const total = computeTotalTime(saved);
    if (total >= 24 * 60 * 60 * 1000) {
      reset();
    } else {
      setTime(total);
      const running = saved.some(i => i.start && i.end === null);
      setIsRunning(running);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(local_store_key, JSON.stringify(intervalsRef.current));
  }, [time, isRunning]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const total = computeTotalTime(intervalsRef.current);
        if (total >= 24 * 60 * 60 * 1000) {
          reset();
        } else {
          setTime(total);
        }
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const total = computeTotalTime(intervalsRef.current);
        if (total >= 24 * 60 * 60 * 1000) {
          reset();
        } else {
          setTime(total);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const computeTotalTime = (intervals) => {
    let total = 0;
    const now = Date.now();
    intervals.forEach(i => {
      if (i.start) {
        total += (i.end || now) - i.start;
      }
    });
    return total;
  };

 
  const reset = () => {
    setIsRunning(false);
    setTime(0);
    intervalsRef.current = [];
    localStorage.removeItem(local_store_key);
  };

  const toggle = () => {
    if (isRunning) {
      // пауза: закрываем последний интервал
      const last = intervalsRef.current[intervalsRef.current.length - 1];
      if (last && !last.end) {
        last.end = Date.now();
      }
      setIsRunning(false);
    } else {
      // старт: новый интервал
      intervalsRef.current.push({ start: Date.now(), end: null });
      setIsRunning(true);
    }
  };

  return (
    <div className="bg-gray-50 mt-2 rounded-lg p-0 w-full text-center">
      <div className="flex justify-center gap-4 m-0 p-0">

        <button
          onClick={reset}
          className={`px-3 py-1 text-white rounded hover:bg-red-600 w-1/2 ${
            time === 0 ? "bg-gray-200" : "bg-red-400"
          }`}
          disabled={time === 0}
        >
          сброс
        </button>
        <div className="text-2xl font-mono mb-1">{formatTimeStopWatch(time)}</div>
        <button
          onClick={toggle}
          className={`px-3 py-1 rounded text-gray-600 font-semibold w-1/2 ${
            isRunning
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-[#9EE539] hover:bg-green-600"
          }`}
        >
          {isRunning ? "|| пауза" : "⏱ старт"}
        </button>
      </div>
    </div>
  );
}

