import { flatten, flattenDeep, fromPairs, toPairs } from "lodash";
import React, { ComponentProps, FC, createContext, createRef, useCallback, useContext, useEffect, useRef, useState } from "react";
import { items } from "./mock";
import { Value, ReactSVGPanZoom, TOOL_NONE, fitSelection, zoomOnViewerCenter, fitToViewer } from 'react-svg-pan-zoom';

import './test.css';
import { PathTest, PathTest2 } from "./Path";
import { RectTest } from "./Item";

export const SVG: FC<ComponentProps<typeof SVGtest2>> = ({
    ...props
}) => {
    return (
        <svg height={400} width={800} className="svg-main">
            <g id='pathesRoot' />
            <SVGtest2
                {...props}
            />
        </svg>
    )
};

const initialValue: Value = {
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

export const Context = createContext(initialValue);

export type Ports = {
    [key: string]: {
        x: number;
        y: number;
        itemId: string;
        id: string;
        width: number;
        height: number;
        connected: string | null;
    },
}

export const initialPorts: {
    ports: Ports,
    setPorts: (newPorts: Ports) => void;
} = {
    ports: {},
    setPorts: () => {}
};

export const PortsContext = createContext(initialPorts);

export const usePortsContext = () => {
    const { ports, setPorts: setPortsState } = useContext(PortsContext);
    const setPorts = useRef(setPortsState);
    return {
        ports,
        setPorts: setPorts.current 
    }
};


export const PathesContext = createContext({});

export const SVGWithZoom: FC<ComponentProps<typeof SVGtest2>> = ({
    ...props
}) => {

    const Viewer = useRef(null);

    const [value, setValue] = useState<Value>(initialValue);
    const [ports, setPortsState] = useState<typeof initialPorts['ports']>(initialPorts.ports);
    const portsRef = useRef(ports);
    const setPorts = useCallback((newPorts: Ports) => {
        const newData = {
            ...portsRef.current,
            ...newPorts
        };
        setPortsState(newData);
        portsRef.current = newData;
    }, []);

    return (
        <PortsContext.Provider value={{ports, setPorts}}>
            <Context.Provider value={value}>
                <ReactSVGPanZoom 
                    ref={Viewer}
                    height={800}
                    width={800}
                    tool={'auto'}
                    onChangeTool={() => {}}
                    value={value}
                    onChangeValue={(val) => setValue(val)}
                    // onZoom={e => console.log('zoom')}
                    // onPan={e => console.log('pan')}
                    // onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
                    customToolbar={() => <></>}
                    customMiniature={() => { return <></> }}
                    style={{ margin: '0 auto' }}
                    // background="#fff"
                >
                    <svg id={'svgroot2'} width={800} height={800}>
                        <SVGtest2
                            {...props}
                        />
                    </svg>
                </ReactSVGPanZoom>
            </Context.Provider>
        </PortsContext.Provider>
    )
};

// if (this.$refs['port-' + port.id]) {
//     let node = port.node
//     let x
//     let y
//     if (port.type === 'in') {
//         x = node.x + 10
//         y = node.y + port.y + 64
//     } else {
//         x = node.x + node.width + 10
//         y = node.y + port.y + 64
//     }

//     return { x, y }
// } else {
//     console.warn(
//         `port "${port.id}" not found. you must call this method after the first render`
//     )
//     return 0
// }

export const SVGtest2: FC<{
    items: typeof items;
}> = ({
    items
}) => {

    const [ its, setIts ] = useState(items);
    const itsRef = useRef(its);

    useEffect(() => {
        console.log(its);
        itsRef.current = its;
    }, [its]);

    const [ pathes, setPathes ] = useState<{[id: string]: string}>({});
    const pathesRef = useRef(pathes);

    useEffect(() => {
        pathesRef.current = pathes;
    }, [pathes]);
    
    const { ports,  } = useContext(PortsContext);

    return (
        <g id={'viewport'}>
        {
            toPairs(its).map(([ _, item ]) => {
                return (
                    <RectTest
                        key={item.id}
                        item={item}
                        onMove={(newItem) => {
                            // setMoveItem(newItem);
                        }}
                        onChange={(newItem) => {
                            setIts({
                                ...itsRef.current,
                                [newItem.id]: newItem
                            });
                            // setMoveItem(null);
                        }}
                    />
                );
            })
        }
            <g id='pathesRoot'>
                {
                    toPairs(ports).map(([ _, port ]) => {
                        if(!port.connected) return null;
                        return <PathTest2
                            key={port.id}
                            fromPort={port.id}
                            toPort={port.connected}
                            connected={null}
                        />
                    })
                }
            </g>
        </g>
    );
};