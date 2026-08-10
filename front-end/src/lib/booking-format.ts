export function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

export function formatCountdown(totalSeconds: number) {
  const sec = Math.max(0, totalSeconds);
  const minutes = Math.floor(sec / 60);
  const remainingSeconds = sec % 60;
  if (minutes > 0) {
    return `${minutes} phút ${remainingSeconds < 10 ? "0" : ""}${remainingSeconds} giây`;
  }
  return `${remainingSeconds} giây`;
}