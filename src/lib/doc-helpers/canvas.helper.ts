import type { ChartData } from "./types";

const SVG_NS = "http://www.w3.org/2000/svg";

const CHART = {
  width: 570,
  height: 300,
  yMax: 200,
  barWidth: 30,
  barGap: 43,
  groupOffsetX: 25,
  groupOffsetY: 30,
  plotOffsetX: 30,
  plotOffsetY: 50,
};

/* ───────────────────────── helpers ───────────────────────── */

const el = <T extends SVGElement>(
  doc: Document,
  name: string,
  attrs: Record<string, string>,
): T => {
  const e = doc.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e as T;
};

const barPath = (value: number, x: number) => {
  const h = (value / 100) * CHART.yMax;
  const yTop = CHART.plotOffsetY + CHART.yMax - h;
  const yBottom = CHART.plotOffsetY + CHART.yMax;

  console.log("barPath", { value, h, yTop, yBottom });
  const maxCurve =
    h === CHART.yMax
      ? `Q ${x} ${yTop - 5}
           ${x + 5} ${yTop - 5}
         L ${x + CHART.barWidth - 5} ${yTop - 5}
         Q ${x + CHART.barWidth} ${yTop - 5}
           ${x + CHART.barWidth} ${yTop}`
      : ``;
  return `
    M ${x} ${yBottom - 10}
    L ${x} ${yTop}
    ${maxCurve}
    L ${x + CHART.barWidth} ${yTop}
    L ${x + CHART.barWidth} ${yBottom - 10}
    Q ${x + CHART.barWidth} ${yBottom}
      ${x + CHART.barWidth - 5} ${yBottom}
    L ${x + 5} ${yBottom}
    Q ${x} ${yBottom}
      ${x} ${yBottom - 10}
    Z
  `;
};

const ticksPath = (x: number) => {
  let d = "";
  for (let i = 4; i <= CHART.yMax; i += 4) {
    const y = CHART.plotOffsetY + CHART.yMax - i;
    const big = i % 40 === 0;
    const start = big ? 5 : 10;
    const len = big ? 20 : 10;
    d += `M ${x + start} ${y} L ${x + start + len} ${y} `;
  }
  return d;
};

/* ───────────────────────── main ───────────────────────── */

export function createChartSvg(data: ChartData, doc: Document): SVGElement {
  const svg = el<SVGSVGElement>(doc, "svg", {
    width: `${CHART.width}`,
    height: `${CHART.height}`,
    viewBox: `0 0 ${CHART.width} ${CHART.height}`,
    fontFamily: "Roboto, Arial, sans-serif",
  });

  /* ── grid lines ── */
  for (let i = 0; i <= CHART.yMax; i += 40) {
    const y = CHART.plotOffsetY + CHART.yMax - i;
    svg.appendChild(
      el(doc, "line", {
        x1: "15",
        x2: `${CHART.width - 30}`,
        y1: `${y}`,
        y2: `${y}`,
        stroke: "rgba(212,212,212,0.5)",
      }),
    );
  }

  /* ── y scale labels ── */
  for (let i = 0; i <= CHART.yMax; i += 40) {
    const y = CHART.plotOffsetY + CHART.yMax - i;
    svg.appendChild(
      el(doc, "text", {
        x: "0",
        y: `${y}`,
        textAnchor: "end",
        "dominant-baseline": "central",
        "font-size": "7",
        fontWeight: "700",
        fill: "black",
      }),
    ).textContent = String(i / 40);
  }

  /* ── bars ── */
  data.groups.forEach((g, i) => {
    const baseX =
      i *
        (((CHART.width - CHART.groupOffsetX) / (data.groups.length * 2)) * 2) +
      CHART.groupOffsetX;

    const x1 = baseX;
    const x2 = baseX + CHART.barGap;

    const middleX =
      baseX + CHART.barWidth + (CHART.barGap - CHART.barWidth) / 2;

    svg.appendChild(
      el(doc, "text", {
        x: `${middleX}`,
        y: `${CHART.plotOffsetY + CHART.yMax / 2}`,
        "text-anchor": "middle",
        "font-size": "7",
        "font-family": "Roboto-Bold",
        "font-weight": "700",
        fill: "#7b7b7b",
      }),
    ).textContent = "vs";

    svg.appendChild(
      el(doc, "path", {
        d: barPath(100, x1),

        style: "filter: drop-shadow(0px 5px 20px rgba(0,0,0,0.1));",
        fill: "#ffffff",
        id: `bg-bar-${i}-1`,
      }),
    );

    svg.appendChild(
      el(doc, "path", {
        d: barPath(100, x2),
        style: "filter: drop-shadow(0px 5px 20px rgba(0,0,0,0.1));",
        fill: "#ffffff",
        id: `bg-bar-${i}-2`,
      }),
    );

    svg.appendChild(
      el(doc, "path", {
        d: barPath(g.explicit, x1),
        fill: "rgba(0,204,255,0.25)",
      }),
    );

    svg.appendChild(
      el(doc, "path", {
        d: barPath(g.implicit, x2),
        fill: "rgba(0,9,255,0.25)",
      }),
    );

    svg.appendChild(
      el(doc, "path", {
        d: ticksPath(x1),
        stroke: "rgb(218,218,218)",
        strokeWidth: "1",
        fill: "none",
      }),
    );

    svg.appendChild(
      el(doc, "path", {
        d: ticksPath(x2),
        stroke: "rgb(218,218,218)",
        strokeWidth: "1",
        fill: "none",
      }),
    );

    /* discrepancy */
    const diff = Math.abs(g.explicit - g.implicit);
    if (diff > 0) {
      const min = Math.min(g.explicit, g.implicit);
      const h = (diff / 100) * CHART.yMax;
      const y = CHART.plotOffsetY + CHART.yMax - (min / 100) * CHART.yMax - h;
      const x = g.explicit < g.implicit ? x1 : x2;

      svg.appendChild(
        el(doc, "rect", {
          x: `${x}`,
          y: `${y}`,
          width: "30",
          height: `${h}`,
          fill: "rgba(238,91,91,0.1)",
          stroke: "rgba(255,0,0,0.5)",
          "stroke-dasharray": "2,2",
        }),
      );

      let discrepancyLabel = [g.discrepancyLabel];
      if (g.discrepancyLabel.includes("\n")) {
        discrepancyLabel = g.discrepancyLabel.split("\n");
      }

      discrepancyLabel.forEach((line, idx) => {
        svg.appendChild(
          el(doc, "text", {
            x: `${x + CHART.barWidth / 2}`,
            y: `${y + h / 2 + (idx - (discrepancyLabel.length - 1) / 2) * 10}`,
            "text-anchor": "middle",
            "font-size": "7",
            "font-family": "Roboto-Bold",
            "font-weight": "700",
            "dominant-baseline": "central",
            fill: "rgba(0,0,0,1)",
          }),
        ).textContent = line;
      });
      // svg.appendChild(
      //   el(doc, "text", {
      //     x: `${x + CHART.barWidth / 2}`,
      //     y: `${y + h / 2}`,
      //     "text-anchor": "middle",
      //     "font-size": "7",
      //     "font-family": "Roboto-Bold",
      //     "font-weight": "700",
      //     "dominant-baseline": "central",
      //     fill: "rgba(255,0,0,0.7)",
      //   }),
      // ).textContent = `${g.discrepancyLabel}`;
    }

    /* x axis labels */
    ["Explicit", "Implicit"].forEach((t, idx) => {
      svg.appendChild(
        el(doc, "text", {
          x: `${(idx === 0 ? x1 : x2) + 4}`,
          y: "260",
          textAnchor: "middle",
          "font-size": "7",
          "font-family": "Roboto-Light",
          "font-weight": "300",
          fill: "#7b7b7b",
        }),
      ).textContent = t;
    });

    /* group labels */
    const lines = g.label.split("\n");

    lines.forEach((line, j) => {
      // ["Integrity", "and Trust"]
      // offset lines on y axis so that the last line is always at the same position which is at the start of the plot area
      // first line should be above next line etc.
      // y starts at the top and text should be placed on top not at the bottom which is CHART.yMax
      const baseY = CHART.plotOffsetY - 10 - (lines.length - 1 - j) * 10;

      svg.appendChild(
        el(doc, "text", {
          x: `${baseX}`,
          // y: `${CHART.groupOffsetY + j * 10}`,
          y: `${baseY}`,
          "font-size": "10",
          fill: "#606060",
        }),
      ).textContent = line;
    });
  });

  return svg;
}
