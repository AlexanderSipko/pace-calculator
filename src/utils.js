// utils.js

export const presets = [
  { label: "100 м - 1/4 круга", value: 0.1 },
  { label: "200 м - 1/2 круга", value: 0.2 },
  { label: "400 м - круг", value: 0.4 },
  { label: "600 м - 1.5 круга", value: 0.6 },
  { label: "800 м - 2 круга", value: 0.8 },
  { label: "1 км - 2.5 круга", value: 1 },
  { label: "1200 м - 3 круга", value: 1.2 },
  { label: "1600 м - 1 миля, 4 круга", value: 1.6 },
  { label: "1800 м - 4.2 круга", value: 1.8 },
  { label: "2000 м - 5 кругов", value: 2 },
  { label: "3000 м - 7.5 кругов", value: 3 },
  { label: "5000 км - 12.5 круга", value: 5 },
  { label: "6000 км - 15 кругов", value: 6 },
  { label: "10 км", value: 10 },
  { label: "Полумарафон 21.097 км", value: 21.097 },
  { label: "Марафон 42.195 км", value: 42.195 },
];

export function parseTime(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map((p) => Number(p || 0));
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(parts[0]) || 0;
}

export function formatTime(secsRaw) {
  if (isNaN(secsRaw) || secsRaw < 0) return "--:--";
  
  // Округляем до целой секунды как Strava
  const secs = Math.round(secsRaw);
  
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  } else {
    return `${m}:${String(s).padStart(2, "0")}`;
  }
}

// Делим дистанцию на километры
export function calculateSplits(distance, totalSeconds) {
  const full = Math.floor(distance);
  const rem = +(distance - full).toFixed(6);
  const segmentsCount = full + (rem > 1e-9 ? 1 : 0);

  const basePace = totalSeconds / distance;

  const res = [];
  let cumulative = 0;
  for (let i = 0; i < segmentsCount; i++) {
    const segLen = i < full ? 1 : rem;
    const segTimeSec = basePace * segLen;
    cumulative += segTimeSec;
    const kmLabel =
      i < full ? i + 1 : +distance.toFixed(distance % 1 === 0 ? 0 : 1);

    res.push({
      kmLabel,
      dist: segLen,
      pacePerKmSec: basePace,
      segmentTimeSec: segTimeSec,
      cumulativeSec: cumulative,
      paceFormatted: formatTime(basePace, "floor"),
      cumulativeFormatted: formatTime(cumulative, "round"),
    });
  }

  if (res.length > 0) {
    res[res.length - 1].cumulativeSec = totalSeconds;
    res[res.length - 1].cumulativeFormatted = formatTime(totalSeconds, "round");
  }

  return res;
}

export function calculateIntervals(avgPacePerKmSec, intervalDistances = [0.1, 0.2, 0.4]) {
  return intervalDistances.map((d) => ({
    dist: d,
    timeSec: avgPacePerKmSec * d,
    timeFormatted: formatTime(avgPacePerKmSec * d, "round"),
  }));
}

export function tempFormat (timeSeconds, mode='time') {

  const min = Math.floor(timeSeconds / 60)

  let sec = Math.round(timeSeconds % 60)
  // if (mode==='pace') {
  //   sec = Math.round(timeSeconds % 60)
  // } else {
  //   sec = Math.floor(timeSeconds % 60)
  // }

  return `${min}${':'}${String(sec).padStart(2, "0")}`
}

export  const formatTimeStopWatch = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  if (ms >= 5 * 60 * 1000) {
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    } else {
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }
  }

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
  } else {
    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
  }
};
