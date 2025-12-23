import Big from "big.js";
import { findElementById, parseHTML } from "./html-parser.js";
import { devPlanDimensionToHexacoKeyMap } from "../hexaco-dimension.map.js";

export const addDiscrepancyImages = (
  doc: Document,
  discrepancyScores: (keyof typeof devPlanDimensionToHexacoKeyMap)[],
  headingText: string,
  getBadge: (dimension: string) => string,
) => {
  if (discrepancyScores.length === 0) {
    return;
  }
  const discrepancySection = findElementById(doc, "discrepancy_scores_section");

  const discrepancyElement = doc.createElement("div");
  discrepancyElement.classList.add("flex", "flex-col");

  const headingElement = doc.createElement("h2");
  headingElement.classList.add("text-gray");
  headingElement.textContent = headingText;

  discrepancyElement.appendChild(headingElement);

  const discrepancyScoresContainer = doc.createElement("div");

  discrepancyScores.forEach((dimensionKey) => {
    const dimension = devPlanDimensionToHexacoKeyMap[dimensionKey];
    const badgeSVG = getBadge(dimension);
    const svgDoc = parseHTML(badgeSVG);
    const svgElement = svgDoc.querySelector("svg") as SVGElement;
    svgElement.classList.add("o-badge-lg");

    discrepancyScoresContainer.appendChild(svgElement);
  });

  discrepancyElement.appendChild(discrepancyScoresContainer);
  discrepancySection.appendChild(discrepancyElement);
};

export const addFitIndexImage = (
  doc: Document,
  iconUrl: string,
  color: string,
  fitIndexPercentage: string,
) => {
  const fitIndexConclusionSectionEl = findElementById(
    doc,
    "fit_index_conclusion_section",
  );
  const image = doc.createElement("img");
  const span = doc.createElement("span");
  const p = doc.createElement("p");
  const p2 = doc.createElement("p");
  const div = doc.createElement("div");
  image.setAttribute("src", iconUrl);
  image.setAttribute("alt", "Fit Index Icon");
  image.classList.add("o-badge");
  p.textContent = `${new Big(fitIndexPercentage).toFixed(0)}%`;
  p2.textContent = "Overall match";

  p.classList.add("fit_index_percentage_value");
  p.classList.add(color);

  span.appendChild(p);
  span.appendChild(p2);
  span.classList.add("o_fit_index_percent");

  div.appendChild(image);
  div.appendChild(span);
  div.classList.add("fit-index-summary");

  fitIndexConclusionSectionEl?.prepend(div);
};
