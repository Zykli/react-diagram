import { flatten, fromPairs } from "lodash";
import { Connections, DiagramItemsType } from "../components/Svg";

const idSplitter = '-';

type PortData = {
    itemId: string;
    portId?: string;
    portType: 'input'| 'output';
};

const getPortString = (type: PortData['portType'], itemId: string, portId?: string) => `${itemId}${idSplitter}${type}${portId ? `${idSplitter}${portId}` : ''}`

export const getInputId = (itemId: string, portId?: string) => getPortString('input', itemId, portId);
export const getOutputId = (itemId: string, portId?: string) => getPortString('output', itemId, portId);

export const getDataFromId = (portId: string): PortData => {
    const splited = portId.split(idSplitter);
    return {
        itemId: splited[0],
        portType: splited[1] as PortData['portType'],
        portId: splited[2]
    };
};

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

export const prepareConnectionsFromItems = (items: DiagramItemsType) => {
    return flatten(Object.values(items).map(el => {
        const items = el.outputs?.map(output => {
            return [ `${el.id}/${output.id}`, output.connected ] as const;
        }) || null;
        const rez = [
            [ el.id, el.output ] as const
        ];
        if(items) {
            rez.push(...items);
        };
        return rez;
    })).reduce((a, c) => {
        return {
            ...a,
            [c[0]]: c[1]
        }
    }, {} as Connections);
};