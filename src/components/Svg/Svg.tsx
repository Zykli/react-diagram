import { cloneDeep, fromPairs, keyBy, toPairs } from "lodash";
import React, { ComponentProps, FC, createContext, createRef, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Value, ReactSVGPanZoom } from 'react-svg-pan-zoom';

import './test.css';
import { Path } from "../Path";
import { ZoomContext, initialZoom } from "../../contexts/zoom";
import { Ports, PortsContext, initialPorts } from "../../contexts/ports";
import { items } from "../../test2/mock";
import { getDataFromId } from "../../utils/utils";
import { Item } from "../Item";

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

export const SVGWithZoom: FC<ComponentProps<typeof SVGtest2>> = ({
    ...props
}) => {

    const Viewer = useRef(null);

    const [value, setValue] = useState<Value>(initialZoom);
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
            <ZoomContext.Provider value={value}>
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
            </ZoomContext.Provider>
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
        console.log('its', its);
        itsRef.current = its;
    }, [its]);

    const [ pathes, setPathes ] = useState<{[id: string]: string}>({});
    const pathesRef = useRef(pathes);

    useEffect(() => {
        pathesRef.current = pathes;
    }, [pathes]);
    
    const { ports, setPorts } = useContext(PortsContext);
    const portsRef = useRef(ports);
    useEffect(() => {
        portsRef.current = ports;
    }, [ports]);

    const removePath = useCallback<ComponentProps<typeof Path>['onRemove']>((from, to) => {
        const portsDatas = [ getDataFromId(from), getDataFromId(to) ];
        const itemsToChange = portsDatas.map(portData => {
            const item = cloneDeep(itsRef.current[portData.itemId]);
            if(portData.portId) {
                item.outputs = item.outputs?.map(el => {
                    if(el.id === portData.portId) {
                        return {
                            ...el,
                            connected: null
                        };
                    }
                    return el;
                })
            } else {
                item[portData.portType] = null;
            }
            return item;
        });
        setIts({
            ...itsRef.current,
            ...keyBy(itemsToChange, 'id')
        });
        setPorts({
            ...fromPairs(toPairs(portsRef.current).filter(el => [from, to].includes(el[0])).map((el) => [ el[0], { ...el[1], connected: null } ]))
        });
    }, []);

    return (
        <g id={'viewport'}>
        {
            toPairs(its).map(([ _, item ]) => {
                return (
                    <Item
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
                        return <Path
                            key={`${port.id}/${port.connected}`}
                            fromPort={port.id}
                            toPort={port.connected}
                            onRemove={removePath}
                        />
                    })
                }
            </g>
        </g>
    );
};