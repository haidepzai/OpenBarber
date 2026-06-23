export const convertDateToTime = (timeStr) => {
  if (!timeStr) return 'N/A';
  // Already in HH:mm or HH:mm:ss format – return directly
  if (/^\d{2}:\d{2}/.test(timeStr)) return timeStr.substring(0, 5);
  // Fallback for legacy full datetime strings
  const date = new Date(timeStr);
  if (isNaN(date.getTime())) return timeStr;
  date.setUTCHours(date.getUTCHours() + 1);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
};
