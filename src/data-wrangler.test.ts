import { expect, test } from "bun:test";
import { encode, decode } from "./data-wrangler";

test("Encoding and decoding produce the same result with small numbers", () => {
  const data = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10));

  const encoded = encode(data, Math.min(...data), Math.max(...data));
  const decoded = decode(encoded, Math.min(...data), Math.max(...data));

  decoded.forEach((d, i) => {
    expect(d).toBeCloseTo(data[i]);
  });
});

test("Encoding and decoding produce the same result with large numbers", () => {
  const data = Array.from({ length: 20 }, () =>
    Math.floor(Math.random() * 1000)
  );

  const encoded = encode(data, Math.min(...data), Math.max(...data));
  const decoded = decode(encoded, Math.min(...data), Math.max(...data));

  decoded.forEach((d, i) => {
    expect(d).toBeCloseTo(data[i], -1.5);
  });
});
