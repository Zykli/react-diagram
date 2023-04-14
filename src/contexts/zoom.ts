import { createContext } from "react";
import { Value } from "react-svg-pan-zoom";

export const initialZoom: Value = {
    SVGHeight: 400,
    SVGWidth: 800,
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    endX: null,
    endY: null,
    f: 0,
    focus: false,
    miniatureOpen: false,
    mode: "idle",
    startX: null,
    startY: null,
    version: 2,
    viewerHeight: 400,
    viewerWidth: 800
};

export const ZoomContext = createContext(initialZoom);