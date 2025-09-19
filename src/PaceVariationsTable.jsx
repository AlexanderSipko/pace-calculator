import React, { useState } from "react";
import { formatTime } from "./utils";

export default function PaceVariationsTable({ basePaceSec, distance }) {

  const [ deltas, setDeltas ] = useState([-8, -4, 0, 4, 8])
  if (!basePaceSec || !distance) return null;

  // Отклонения темпа (можно менять шаг)
  const paces = deltas.map((d) => basePaceSec + d);

  // Список дистанций
  const distances = [];

  if (distance <= 3) {
    // Добавляем "короткие" отрезки
    const shortSegments = [0.1, 0.2, 0.4, 0.8, 1.2, 1.6];
    shortSegments.forEach(seg => {
      if (seg < distance) distances.push(seg);
    });
  }

  // Добавляем километровые шаги
  for (let km = 1; km <= Math.floor(distance); km++) {
    distances.push(km);
  }
  if (distance % 1 !== 0) distances.push(distance); // например, 2.5 или 21.1 км

  return (
    <div className="bg-gray-100 shadow-md rounded-lg p-1 overflow-x-auto mt-2">
      {/* <h2 className="font-semibold text-green-800 mb-2">
        Вариативность темпа
      </h2> */}
      <table className="min-w-full border-collapse border border-green-400 text-sm">
        <thead>
          <tr className="bg-gray-600">
            <th className="border border-gray-100 p-1 text-gray-200 w-1">pace</th>
            {paces.map((p, i) => {
              const isMiddle = i === Math.floor(paces.length / 2);
              return (<th key={i} className={`border border-gray-100 py-1 text-gray-200 w-1 ${isMiddle ? "text-gray-900 bg-[#9EE539] border-2 border-gray-800" : ""}`}>
                        {Math.floor(p / 60)}:{String(Math.floor(p % 60)).padStart(2, "0")}
                      </th>)
              })}
          </tr>
        </thead>
        <tbody>
          {distances.map((d, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-200 text-gray-600 font-bold"}>
              <td className="border border-gray-400 p-1 text-center">
                {d < 1 ? `${Math.round(d * 1000)} м` : `${d} км`}
              </td>
              {paces.map((p, j) => {
                const isMiddle = j === Math.floor(paces.length / 2);
                return (
                  <td
                    key={j}
                    className={`border border-gray-400 p-1 text-center ${isMiddle ? "text-gray-900 bg-[#9EE539]" : ""}`}
                  >
                  {formatTime(Math.round(p * d), "floor")}
                  </td>
                );
            })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
