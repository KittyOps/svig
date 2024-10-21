const b62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function encode(data: number[], min: number, max: number): string {
  const r = max - min;
  const bs = new Uint8Array(data.length);

  if (r === 0) {
    for (let i = 0; i < data.length; i++) {
      bs[i] = b62.charCodeAt(0);
    }
    return String.fromCharCode(...bs);
  }

  const encLen = b62.length - 1;
  for (let i = 0; i < data.length; i++) {
    const y = data[i];
    const index = Math.floor((encLen * (y - min)) / r);
    if (index >= 0 && index < b62.length) {
      bs[i] = b62.charCodeAt(index);
    } else {
      bs[i] = b62.charCodeAt(0);
    }
  }

  return String.fromCharCode(...bs);
}

export default encode;
