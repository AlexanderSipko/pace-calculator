// TargetInfo.jsx
import React from "react";
import { formatTime, tempFormat } from "./utils";


export default function TargetInfo({ mode }) {

  if (mode !== 'time') {
    return null
  }
  return (
        <p className='
        bg-gray-50 w-full m-0 text-center text-[12px]
        text-red-400 shadow-md rounded-lg px-2 py-2 space-y-2'>
          Для точного планирования используйте "Расчет по темпу"
        </p>
  );
}
