

export function getAbsoluteXY (element: SVGSVGElement) {
    let viewportElement = document.documentElement
    let box = element.getBoundingClientRect()
    let scrollLeft = viewportElement.scrollLeft
    let scrollTop = viewportElement.scrollTop
    let x = box.left + scrollLeft
    let y = box.top + scrollTop
    return { x: x, y: y }
}

export const convertXYtoViewPort = (x: number, y: number) => {
    let rec = document.getElementById('viewport') as SVGGElement | null;
    if(!rec) return;
    let rootelt = rec.closest('g[transform]')?.closest('svg') as SVGSVGElement | null;
    if(!rootelt || !rec) return;
    let point = rootelt.createSVGPoint()
    let rooteltPosition = getAbsoluteXY(rootelt)
    point.x = x - rooteltPosition.x
    point.y = y - rooteltPosition.y
    let ctm = rec.getCTM()?.inverse();
    return point.matrixTransform(ctm)
};