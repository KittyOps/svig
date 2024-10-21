import { Hono } from "hono";
import { parseHTML } from "linkedom/worker";
import * as Plot from "@observablehq/plot";
import encode from "./data-wrangler";

const app = new Hono();

app.get("/", (c) => {
  return c.html(
    `<!DOCTYPE html><html><body><img src="/chart.svg" /></body></html>`
  );
});

app.get("/chart.svg", (c) => {
  const data = Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 100)
  );

  const { document } = parseHTML("<!DOCTYPE html><html><body></body></html>");

  const plot = Plot.plot({
    document: document,
    width: 640,
    height: 400,
    y: {
      grid: true,
      label: "Value ↑",
      domain: [0, Math.max(...data) * 1.1],
      nice: true,
      inset: 10,
    },
    x: {
      label: "Step →",
      inset: 6,
    },
    marginTop: 40,
    marginRight: 40,
    marginBottom: 40,
    marginLeft: 60,
    style: {
      background: "transparent",
      overflow: "visible",
    },
    marks: [
      Plot.areaY(data, {
        x: (d, i) => i,
        y2: 0,
        curve: "step-after",
        fill: "lightblue",
        fillOpacity: 0.6,
      }),
      Plot.lineY(data, {
        x: (d, i) => i,
        curve: "step-after",
        stroke: "steelblue",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }),
    ],
  });

  plot.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns",
    "http://www.w3.org/2000/svg"
  );
  plot.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );

  // Convert the plot object to a string
  const svgString = plot.toString();

  return c.newResponse(svgString, 200, {
    "Content-Type": "image/svg+xml",
  });
});

app.post("/", async (c) => {
  const { d0, d1, d2, d3, d4 } = await c.req.json();

  const encoded = encode(d0, 0, 300);
  return c.text(encoded);
});

export default app;
