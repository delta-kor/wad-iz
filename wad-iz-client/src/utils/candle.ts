export function parseCandleData(data: number[], timestamp: number[]): CandleData[] {
  const result: CandleData[] = [];

  let lastAmount = data[0];

  let index = 0;
  for (const item of data.slice(1)) {
    if (lastAmount - item === 0) {
      index++;
      continue;
    }
    result.push({
      to: lastAmount,
      from: item,
      delta: lastAmount - item,
      timestamp: new Date(timestamp[index]),
    });
    lastAmount = item;
    index++;
  }

  return result;
}
