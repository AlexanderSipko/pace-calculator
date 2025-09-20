import React, { useState, useEffect, useRef } from "react";

export default function Stopwatch({time, setTime}) {
  
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10); // обновляем каждые 10 мс
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}.${String(centiseconds).padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-1 w-full text-center">
      
      <div className="flex justify-center gap-4 m-0 p-0">
        <button
          onClick={handleReset}
          className={`px-3 py-1  text-white rounded hover:bg-red-600
            ${time === 0 ? 'bg-gray-400' : 'bg-red-400'}
          `}
          disabled={time === 0}
        >
          сброс
        </button>
        <div className="text-2xl font-mono mb-1">{formatTime(time)}</div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-3 py-1 rounded text-gray-600 font-semibold ${
            isRunning ? "bg-yellow-500 hover:bg-yellow-600" : "bg-[#9EE539] hover:bg-green-600"
          }`}
        >
          {isRunning ? "|| пауза" : "⏱ старт"}
        </button>
      </div>
    </div>
  );
}
