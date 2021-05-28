// Fomat thời gian video từ giây sang dạng mm:ss
// Ví dụ. 70s -> 01:10
export const formatTimeRange = (timeRange: number): string => {
  const mins = Math.floor(timeRange / 60);
  const seconds = timeRange - mins * 60;

  return `${mins < 10 ? "0" + mins : mins}:${seconds < 10 ? "0" + seconds : seconds}`;
};
