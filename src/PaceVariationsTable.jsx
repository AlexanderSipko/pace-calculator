import React, { useState, useRef } from "react";
import { formatTime, tempFormat } from "./utils";

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
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
  
    iframe.contentDocument.write(`
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
  
    iframe.contentDocument.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  const moreThenTargetSeconds = (secondTimer, secondTarget) => {
    if (secondTimer >= secondTarget) {
      return <span className="text-white text-[8px] absolute top-1 right-9 opacity-80">✔</span>
    }
    return null
  }

  const isMiddle = (i, paces) => i === Math.floor(paces.length / 2);

  return (
    <div>
      <div
        ref={tableRef}
        className="bg-gray-100 shadow-md rounded-lg p-1 overflow-auto mt-1"
      >
        <table className="min-w-full border-collapse border border-green-400 text-sm">
          <thead className="bg-gray-600">
            <tr className="bg-gray-600">
              <th className="border border-gray-100 p-1 text-gray-200 w-10 h-10">Km</th>
              {paces.map((p, i) => {
                const totalTime = p * distance;
                return (
                  <th
                    key={i}
                    className={`
                        border border-gray-100 py-1 text-gray-200 relative
                        ${
                          isMiddle(i, paces)
                            ? "text-gray-900 bg-[#9EE539] border-2 border-gray-800"
                            : ""
                        }
                        `}
                  >
                    <span className="absolute bottom-0 right-1 after:content-['/км'] after:text-[10px] after:opacity-55" >
                      {tempFormat(p )}
                    </span>
                    <span className={`text-[8px]  ${
                          isMiddle(i, paces)
                            ? "text-[#9EE539]"
                            : "text-gray-600"
                        }`}>-</span>
                    <span className={`block text-[14px] absolute top-0 left-2
                      ${
                        isMiddle(i, paces)
                          ? "text-gray-600"
                          : "text-gray-400"
                      }
                    `}>
                      {formatTime(totalTime)}
                    </span>
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
                        <span className="absolute top-[2%] left-1 text-[12px]">
                          {formatNumber(d)}
                        </span>
                        <span className="text-[10px] opacity-60 absolute bottom-0 right-0.5 ">
                          {trainNumber(d / 0.4)}
                        </span>
                      </>
                    ) : (
                      <span className="text-[14px]">{formatNumber(d)}</span>
                    )}
                  </td>
                  {paces.map((p, j) => {
                    return (
                      <td
                        key={j}
                        className={`
                        border border-gray-400 p-1 text-center
                        ${isMiddle(j, paces) ? "text-gray-900 bg-[#9EE539] text-[16px]" : ""}
                        ${moreThenTargetSeconds(time / 1000, p * d) ? "bg-red-200 font-bold" : ""}
                        `}
                      >
                        {formatTime(p * d)}
                        {/* {moreThenTargetSeconds(time / 1000, p * d)} */}
                      </td>
                    );
                  })}
                </tr>
                
              ))}
              <tr className="bg-gray-600">
            <td className="border border-gray-100 p-1 text-gray-200"></td>
            {paces.map((p, i) => {
              return (
                <th key={i} className="border border-gray-100 py-1 text-gray-200 relative h-6">
                  <span className="absolute bottom-0 right-1 after:content-['/км'] after:text-[10px] after:opacity-55" >
                      {tempFormat(p )}
                    </span>
                </th>
              );
            })}
          </tr>
          </tbody>
        </table>
      </div>
            {/* Кнопка печати */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handlePrint}
          className="
            mb-2 px-3 py-1 bg-gray-600 text-white rounded 
            hover:bg-[#9EE539] hover:text-gray-600"
             >🖨️
        </button>
      </div>
    </div>
  );
}
