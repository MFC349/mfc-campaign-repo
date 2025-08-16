export const pad2 = (n) => {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  return sign + (abs < 10 ? `0${abs}` : String(abs));
};
