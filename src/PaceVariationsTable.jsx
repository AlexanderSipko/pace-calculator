import React, { useState, useRef } from "react";
import { formatTime } from "./utils";

export default function PaceVariationsTable({ basePaceSec, distance, time }) {
  const [deltas, setDeltas] = useState([-8, -4, 0, 4, 8]);
  const tableRef = useRef(null);

  if (!basePaceSec || !distance) return null;

  const paces = deltas.map((d) => basePaceSec + d);
  const distances = [];

  const limitDistance = (distance, customLimit = 6) => {
    return distance <= customLimit;
  };

  if (limitDistance(distance)) {
    const shortSegments = [0.1, 0.2, 0.4, 0.8, 1.2, 1.6];
    shortSegments.forEach((seg) => {
      if (seg < distance) distances.push(seg);
    });
  }

  for (let km = 1; km <= Math.floor(distance); km++) {
    if (!distances.includes(km)) {
      distances.push(km);
    }
  }

  if (distance % 1 !== 0) distances.push(distance);

  function formatNumber(num) {
    if (num < 1) {
      return num;
    }

    const formatter = new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });

    return `${formatter.format(num)}`;
  }

  function trainNumber(num) {
    if (num < 1) {
      const fractions = {
        0.25: "1/4",
        0.5: "1/2",
        0.75: "3/4",
        0.1: "1/10",
        0.2: "1/5",
        0.4: "2/5",
        0.8: "4/5",
      };

      if (fractions.hasOwnProperty(num)) {
        return fractions[num];
      }

      return num;
    }

    const formatter = new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });

    return `${formatter.format(num)}`;
  }

  const handlePrint = () => {
    const printContents = tableRef.current.innerHTML;
    const newWindow = window.open("", "", "width=800,height=600");
    newWindow.document.write(`
      <html>
        <head>
          <title>Таблица темпов</title>
          <style>
            body { font-family: sans-serif; padding: 10px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 4px; text-align: center; }
            th { background: #eee; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  const moreThenTargetSeconds = (secondTimer, secondTarget) => {
    if (secondTimer >= secondTarget) {
      return <span className="text-white text-[8px] absolute top-1 right-9 opacity-80">✔</span>
    }
    return null
  }

  return (
    <div>


      {/* Таблица */}
      <div
        ref={tableRef}
        className="bg-gray-100 shadow-md rounded-lg p-1 overflow-auto mt-1"
      >
        <table className="min-w-full border-collapse border border-green-400 text-sm">
          <thead className="bg-gray-600">
            <tr className="bg-gray-600">
              <th className="border border-gray-100 p-1 text-gray-200">km</th>
              {paces.map((p, i) => {
                const isMiddle = i === Math.floor(paces.length / 2);
                return (
                  <th
                    key={i}
                    className={`
                        border border-gray-100 py-1 text-gray-200
                        ${
                          isMiddle
                            ? "text-gray-900 bg-[#9EE539] border-2 border-gray-800"
                            : ""
                        }
                        `}
                  >
                    {Math.floor(p / 60)}:
                    {String(Math.floor(p % 60)).padStart(2, "0")}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {distances
              .sort((a, b) => a - b)
              .map((d, i) => (
                <tr
                  key={i}
                  className={
                    i % 2 === 0
                      ? "bg-white"
                      : "bg-gray-200 text-gray-600 font-bold"
                  }
                >
                  <td className="border border-gray-400 p-1 text-center relative text-[16px]">
                    {limitDistance(distance, 10) ? (
                      <>
                        <span className="absolute top-[2%] left-1">
                          {formatNumber(d)}
                        </span>
                        <span className="text-[10px] opacity-60 absolute bottom-0 right-0.5">
                          {trainNumber(d / 0.4)}
                        </span>
                      </>
                    ) : (
                      <span className="">{formatNumber(d)}</span>
                    )}
                  </td>
                  {paces.map((p, j) => {
                    const isMiddle = j === Math.floor(paces.length / 2);
                    return (
                      <td
                        key={j}
                        className={`
                        border border-gray-400 p-1 text-center
                        ${isMiddle ? "text-gray-900 bg-[#9EE539] text-[16px]" : ""}
                        ${moreThenTargetSeconds(time / 1000, p * d) ? "bg-red-200 font-bold" : ""}
                        `}
                      >
                        {formatTime(Math.round(p * d), "floor")}
                        {/* {moreThenTargetSeconds(time / 1000, p * d)} */}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
            {/* Кнопка печати */}
      <div className="flex justify-end pt-4">
        <button
                onClick={handlePrint}
                className="mb-2 px-3 py-1 bg-gray-600 text-white rounded hover:bg-[#9EE539] hover:text-gray-600"
              >
                🖨️
        </button>
      </div>
    </div>
  );
}
