import { Canvas, CanvasRenderingContext2D, createCanvas } from "canvas";
import { JSDOM } from "jsdom";
import { applyPath2DToCanvasRenderingContext } from "path2d";
const CANVAS_SYMBOL = Symbol("node-canvas");

export function parseHTML(html: string) {
  const dom = new JSDOM(html);
  const proto = dom.window.HTMLCanvasElement.prototype as HTMLCanvasElement & {
    _canvas?: ReturnType<typeof createCanvas>;
  };
  // @ts-expect-error Override getContext to use node-canvas
  applyPath2DToCanvasRenderingContext(CanvasRenderingContext2D);
  // @ts-expect-error Override getContext to use node-canvas
  proto.getContext = function (type: "2d"): CanvasRenderingContext2D | null {
    if (!this[CANVAS_SYMBOL]) {
      this[CANVAS_SYMBOL] = createCanvas(this.width, this.height);
    }
    return this[CANVAS_SYMBOL].getContext(
      type,
    ) as unknown as CanvasRenderingContext2D;
  };

  return dom.window.document;
}

export function canvasToBuffer(el: HTMLCanvasElement): Buffer {
  const canvas = (el as any)[CANVAS_SYMBOL] as Canvas | undefined;
  if (!canvas) {
    throw new Error("Canvas has no backing node-canvas instance");
  }
  return canvas.toBuffer();
}

export function findElementById(doc: Document, id: string) {
  return doc.getElementById(id);
}

export function createElement(doc: Document, tagName: string) {
  return doc.createElement(tagName);
}

export function setElementText(element: Element, text: string) {
  element.textContent = text;
}

export function appendChild(parent: Element, child: Node) {
  parent.appendChild(child);
}

export function serializeDocument(doc: Document) {
  return doc.documentElement.outerHTML;
}

export function getElementsByTagName(doc: Document, tagName: string) {
  return doc.getElementsByTagName(tagName);
}
