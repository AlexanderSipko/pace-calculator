// utils.js
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