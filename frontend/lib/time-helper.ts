export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const convertToUTC = (date: Date, timeString: string): string => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const localDateTime = new Date(date);
  localDateTime.setHours(hours, minutes, 0, 0);
  const utcHours = localDateTime.getUTCHours();
  const utcMinutes = localDateTime.getUTCMinutes();
  return `${String(utcHours).padStart(2, "0")}:${String(utcMinutes).padStart(2, "0")}`;
};
