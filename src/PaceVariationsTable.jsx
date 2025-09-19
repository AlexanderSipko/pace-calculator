import React, { useState } from "react";
import { formatTime } from "./utils";

export default function PaceVariationsTable({ basePaceSec, distance }) {

  const [ deltas, setDeltas ] = useState([-8, -4, 0, 4, 8])
  if (!basePaceSec || !distance) return null;

  // Отклонения темпа (можно менять шаг)
  const paces = deltas.map((d) => basePaceSec + d);

  // Список дистанций
  const distances = [];

  const limitDistance = (distance, customLimit=6) => {

    return distance <= customLimit
  }

  if (limitDistance(distance)) {
    // Добавляем "короткие" отрезки
    const shortSegments = [0.1, 0.2, 0.4, 0.8, 1.2, 1.6];
    shortSegments.forEach(seg => {
      if (seg < distance) distances.push(seg);
    });
  }

  // Добавляем километровые шаги
  for (let km = 1; km <= Math.floor(distance); km++) {
    if (!distances.includes(km)) {
      distances.push(km);
    }
  }
  
  // distances = Array.from(distances).sort((a, b) => a - b);

  if (distance % 1 !== 0) distances.push(distance); // например, 2.5 или 21.1 км

  function formatNumber(num) {
    if (num < 1) {
      return num;
    }
    
    const formatter = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    });
    
    return `${formatter.format(num)}`;
  }

  function trainNumber(num) {
    if (num < 1) {
      // Преобразуем десятичные дроби в обычные
      const fractions = {
        0.25: '1/4',
        0.5: '1/2', 
        0.75: '3/4',
        0.1: '1/10',
        0.2: '1/5',
        0.4: '2/5',
        0.8: '4/5'
      };
      
      // Проверяем, есть ли точное соответствие
      if (fractions.hasOwnProperty(num)) {
        return fractions[num];
      }
      
      // Для других значений меньше 1 оставляем как есть
      return num;
    }
    
    // Для чисел от 1 и больше используем прежнее форматирование
    const formatter = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    });
    
    return `${formatter.format(num)}`;
  }

  return (
    <div className="bg-gray-100 shadow-md rounded-lg p-1 overflow-auto mt-1">
      <table className="min-w-full border-collapse border border-green-400 text-sm">
        <thead className="bg-gray-600">
          <tr className="bg-gray-600">
            <th className="border border-gray-100 p-1 text-gray-200">km</th>
            {paces.map((p, i) => {
              const isMiddle = i === Math.floor(paces.length / 2);
              return (<th key={i} className={`
                        border border-gray-100 py-1 text-gray-200
                        ${isMiddle ? "text-gray-900 bg-[#9EE539] border-2 border-gray-800" : ""}
                        `}>
                        {Math.floor(p / 60)}:{String(Math.floor(p % 60)).padStart(2, "0")}
                      </th>)
              })}
          </tr>
        </thead>
        <tbody>
          {distances.sort((a, b) => a - b).map((d, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-200 text-gray-600 font-bold"}>
              <td className="border border-gray-400 p-1 text-center relative text-[16px]">
                {limitDistance(distance, 10) ?
                  <>
                  <span className="absolute top-[2%] left-1">
                    {formatNumber(d)} 
                  </span>
                  <span className="text-[10px] opacity-60 absolute bottom-0 right-0.5">
                    {trainNumber(d / 0.4)}
                  </span>
                  </>:
                  <span className="">
                    {formatNumber(d)} 
                  </span>
                }
              </td>
              {paces.map((p, j) => {
                const isMiddle = j === Math.floor(paces.length / 2);
                return (
                  <td
                    key={j}
                    className={`
                    border border-gray-400 p-1 text-center
                    ${isMiddle ? "text-gray-900 bg-[#9EE539] text-[16px]" : ""}
                    `}
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
