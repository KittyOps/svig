import { Hono } from "hono";
import { parseHTML } from "linkedom/worker";
import * as Plot from "@observablehq/plot";
import { encode, decode } from "./data-wrangler";

const app = new Hono();

app.get("/", (c) => {
  return c.html(
    `<!DOCTYPE html><html><body><img src="/chart.svg?w=580&h=180&d0=caaageehox301yusuurywwqmjdghhhjmrt0yywwuqrs2yslkgfahnomqux666zzvttv0wsmkgdbhmnlrsz6795420xtvtrnjgdadkopqqv256520zxsssokfdZZbeffjltwzzzxussuywrmgbYWaeefjmu100ywsqqrvuoidb&ymin=0&ymax=160000000" /></body></html>`
  );
});

app.get("/decode", (c) => {
  const { d0, ymin, ymax } = c.req.query();
  const data = decode(d0, parseFloat(ymin), parseFloat(ymax));
  return c.json(data);
});

// ymin=0&ymax=160000000&t=1+week+@+1+hour&step=1

app.get("/chart.svg", (c) => {
  const { w, h, d0, ymin, ymax } = c.req.query();
  const data = decode(d0, parseFloat(ymin), parseFloat(ymax));

  const { document } = parseHTML("<!DOCTYPE html><html><body></body></html>");

  const plot = Plot.plot({
    document: document,
    width: parseInt(w) || 600,
    height: parseInt(h) || 250,
    y: {
      grid: true,
      label: "Value ↑",
      domain: [0, parseFloat(ymax) * 1.1],
      nice: true,
      inset: 0,
      line: true,
      tickFormat: (d) => {
        if (d >= 1_000_000) {
          return `${(d / 1_000_000).toFixed(0)}M`;
        } else if (d >= 1_000) {
          return `${(d / 1_000).toFixed(0)}K`;
        }
        return d.toString();
      },
    },
    x: {
      label: "Step →",
      inset: 0,
      line: true,
    },
    marginTop: 20,
    marginRight: 40,
    marginBottom: 20,
    marginLeft: 60,
    style: {
      background: "transparent",
      overflow: "visible",
    },
    marks: [
      Plot.areaY(data, {
        x: (d, i) => i,
        y: (d) => d,
        y2: () => 0,
        curve: "step-after",
        fill: "#1FFFB4",
        fillOpacity: 0.7,
        stroke: null,
      }),
      Plot.lineY(data, {
        x: (d, i) => i,
        y: (d) => d,
        curve: "step-after",
        stroke: "#00CC88",
        strokeWidth: 1.5,
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
