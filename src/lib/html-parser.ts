import { JSDOM } from "jsdom";

export function parseHTML(html: string) {
  const dom = new JSDOM(html).window.document;
  return dom;
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
