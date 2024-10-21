const b62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function encode(data: number[], min: number, max: number): string {
  const r = max - min;
  const bs = new Uint8Array(data.length);

  if (r === 0) {
    return "A".repeat(data.length);
  }

  const encLen = b62.length - 1;
  for (let i = 0; i < data.length; i++) {
    const y = data[i];
    const index = Math.round((encLen * (y - min)) / r);
    bs[i] = b62.charCodeAt(Math.max(0, Math.min(index, encLen)));
  }

  return String.fromCharCode(...bs);
}

export function decode(encoded: string, min: number, max: number): number[] {
  const r = max - min;
  const encLen = b62.length - 1;
  const decoded: number[] = [];

  for (let i = 0; i < encoded.length; i++) {
    const char = encoded[i];
    const index = b62.indexOf(char);

    if (index === -1) {
      throw new Error(`Invalid character '${char}' in encoded string.`);
    }

    // Reverse the encoding formula to get the original value and round to nearest integer
    const value = Math.round(min + (index / encLen) * r);
    decoded.push(value);
  }

  return decoded;
}
