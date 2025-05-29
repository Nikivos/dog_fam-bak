export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}ч`);
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}м`);
  }
  parts.push(`${remainingSeconds}с`);

  return parts.join(' ');
}; 