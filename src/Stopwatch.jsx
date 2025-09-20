import React, { useState, useEffect, useRef } from "react";

export default function Stopwatch({time, setTime}) {
//   const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalsRef = useRef([]); // массив интервалов {start, end|null}
  const intervalRef = useRef(null);

  let local_store_suffix = import.meta.env.VITE_MODE
  local_store_suffix = local_store_suffix === undefined ? '_dev' : local_store_suffix
  const local_store_key = "stopwatch" + local_store_suffix
  // console.log(local_store_key)

  // загрузка из localStorage
  useEffect(() => {
    
    const saved = JSON.parse(localStorage.getItem(local_store_key)) || [];
    // console.log(saved, import.meta.env.VITE_MODE || '_dev')
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

  // сохраняем в localStorage
  useEffect(() => {
    localStorage.setItem(local_store_key, JSON.stringify(intervalsRef.current));
  }, [time, isRunning]);

  // интервал тика
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

  // синхронизация при возвращении на вкладку
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

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
    } else {
        return `${minutes}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
    }
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
    <div className="bg-white shadow-md rounded-lg p-1 w-full text-center">
      <div className="flex justify-center gap-4 m-0 p-0">
        <button
          onClick={reset}
          className={`px-3 py-1 text-white rounded hover:bg-red-600 ${
            time === 0 ? "bg-gray-400" : "bg-red-400"
          }`}
          disabled={time === 0}
        >
          сброс
        </button>
        <div className="text-2xl font-mono mb-1">{formatTime(time)}</div>
        <button
          onClick={toggle}
          className={`px-3 py-1 rounded text-gray-600 font-semibold ${
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
