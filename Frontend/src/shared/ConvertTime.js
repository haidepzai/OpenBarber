export const convertDateToTime = (timeStr) => {
    const date = new Date(timeStr);
    date.setUTCHours(date.getUTCHours() + 1); // Add 1 hour to the UTC time
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const time = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
    return time;
}