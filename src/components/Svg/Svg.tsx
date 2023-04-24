import { cloneDeep, fromPairs, keyBy, toPairs } from "lodash";
import React, { ComponentProps, FC, createContext, createRef, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Value, ReactSVGPanZoom } from 'react-svg-pan-zoom';
import { Path } from "../Path";
import { ZoomContext, initialZoom } from "../../contexts/zoom";
import { Ports, PortsContext, initialPorts } from "../../contexts/ports";
import { Item as ItemType } from "../../utils/types";
import { convertXYtoViewPort, getDataFromId, getInputId } from "../../utils/utils";
import { Item } from "../Item";
import { useWindowSize } from '@react-hook/window-size';
import './Svg.css';

export type DiagramItemsType = {[key: string]: ItemType};

type Props = {
    /**
     * Items for view
     */
    items: DiagramItemsType;

    /**
     * Items change function  
     * Trigger at drag, remove, connect, remove connect etc.
     * @param newItems 
     * @returns 
     */
    onChange: (newItems: DiagramItemsType) => void;

    /**
     * Function to change item, if define then edit button will be view
     * @param item 
     * @returns 
     */
    onItemChangeClick?: (item: DiagramItemsType[keyof DiagramItemsType]) => void;

    /**
     * Function to confirm delete item  
     * must return "true" for delete item
     * @param item 
     * @returns 
     */
    onItemDeleteClick?: (item: DiagramItemsType[keyof DiagramItemsType]) => boolean;
};

export const SVGReactDiagram: FC<ComponentProps<typeof SVGWithZoom>> = ({
    ...props
}) => {

    const Viewer = useRef(null);

    const [value, setValue] = useState<Value>(initialZoom);
    const [ports, setPortsState] = useState<typeof initialPorts['ports']>(initialPorts.ports);
    const portsRef = useRef(ports);
    const changePorts = useCallback((newPorts: Ports) => {
        const newData = {
            ...portsRef.current,
            ...newPorts
        };
        portsRef.current = newData;
        setPortsState(newData);
    }, []);
    const setPorts = useCallback((newPorts: Ports) => {
        portsRef.current = newPorts;
        setPortsState(newPorts);
    }, []);

    const [width, height] = useWindowSize({initialWidth: 800, initialHeight: 800});

    return (
        <PortsContext.Provider value={{ports, changePorts, setPorts}}>
            <ZoomContext.Provider value={value}>
                <div 
                    className={'ReactSVGPanZoom'}
                >
                    <ReactSVGPanZoom 
                        ref={Viewer}
                        height={600}
                        width={width - 2}
                        tool={'auto'}
                        onChangeTool={() => {}}
                        value={value}
                        onChangeValue={(val) => setValue(val)}
                        // onZoom={e => console.log('zoom')}
                        // onPan={e => console.log('pan')}
                        // onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
                        detectAutoPan={false}
                        disableDoubleClickZoomWithToolAuto={true}
                        customToolbar={() => <></>}
                        customMiniature={() => { return <></> }}
                        style={{ margin: '0 auto' }}
                        background="#fff"
                        SVGBackground="transparent"
                    >
                        <svg id={'svgroot2'} width={800} height={800}>
                            <SVGWithZoom
                                {...props}
                            />
                        </svg>
                    </ReactSVGPanZoom>
                </div>
            </ZoomContext.Provider>
        </PortsContext.Provider>
    )
};

const SVGWithZoom: FC<Props> = ({
    items,
    onChange,
    onItemChangeClick,
    onItemDeleteClick
}) => {

    const itsRef = useRef(items);
    useEffect(() => {
        itsRef.current = items;
    }, [items]);
    
    const { ports, changePorts, setPorts } = useContext(PortsContext);
    const portsRef = useRef(ports);
    useEffect(() => {
        // console.log('ports', ports);
        portsRef.current = ports;
    }, [ports]);

    const [ initedNewPath, setInitedNewPath ] = useState('');
    const newPathRef = useRef(initedNewPath);
    useEffect(() => {
        newPathRef.current = initedNewPath;
    }, [initedNewPath]);

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
        changePorts({
            ...fromPairs(toPairs(portsRef.current).filter(el => [from, to].includes(el[0])).map((el) => [ el[0], { ...el[1], connected: null } ]))
        });
        onChange({
            ...itsRef.current,
            ...keyBy(itemsToChange, 'id')
        });
    }, []);
    
    const onMouseMove = useCallback((e: MouseEvent) => {
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        let coords = convertXYtoViewPort(mouseX, mouseY);
        if(!coords) return ;
        const newX = coords.x;
        const newY = coords.y;
        const cursorPort = portsRef.current[getInputId('cursor')];
        changePorts({
            [getInputId('cursor')]: {
                ...cursorPort,
                x: newX - cursorPort.width / 2,
                y: newY - cursorPort.height / 2
            }
        });
    }, []);

    const onMouseUp = useCallback((e: MouseEvent) => {
        const fromPortId = newPathRef.current;
        const fromPort = portsRef.current[fromPortId];
        setInitedNewPath('');
        changePorts({
            [fromPort.id]: {
                ...fromPort,
                connected: null
            }
        });
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }, []);

    const onPortMouseDown: ComponentProps<typeof Item>['onPortMouseDown'] = useCallback((portId, e) => {
        const fromPort = portsRef.current[portId];
        const fromPortData = getDataFromId(portId.toString());
        if(!fromPort.connected && fromPortData.portType !== 'input') {
            const mouseX = e.pageX;
            const mouseY = e.pageY;
            let coords = convertXYtoViewPort(mouseX, mouseY);
            const newX = coords?.x || 0;
            const newY = coords?.y || 0;
            const cursorPort = portsRef.current[getInputId('cursor')];
            changePorts({
                [getInputId('cursor')]: {
                    ...cursorPort,
                    x: newX - cursorPort.width / 2,
                    y: newY - cursorPort.height / 2
                },
                [fromPort.id]: {
                    ...fromPort,
                    connected: getInputId('cursor')
                }
            });
            setInitedNewPath(portId.toString());
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
    }, []);

    const onPortMouseUp: ComponentProps<typeof Item>['onPortMouseUp'] = useCallback((portId) => {
        const fromPort = newPathRef.current;
        const fromPortData = getDataFromId(newPathRef.current);
        const toPortData = getDataFromId(portId.toString());
        if(toPortData.portType === 'output') {
            changePorts({
                ...fromPairs(
                    toPairs(portsRef.current)
                        .filter(el => [fromPort].includes(el[0]))
                        .map((el) => [ el[0], { ...el[1], connected: null } ])
                    )   
            });
            setInitedNewPath('');
        } else
        if(newPathRef.current && newPathRef.current !== portId) {
            changePorts({
                ...fromPairs(
                    toPairs(portsRef.current)
                        .filter(el => [fromPort].includes(el[0]))
                        .map((el) => [ el[0], { ...el[1], connected: portId.toString() } ])
                    )   
            });
            const itemsToChange = [ fromPortData ].map(portData => {
                const item = cloneDeep(itsRef.current[portData.itemId]);
                if(portData.portId) {
                    item.outputs = item.outputs?.map(el => {
                        if(el.id === portData.portId) {
                            return {
                                ...el,
                                connected: toPortData.itemId
                            };
                        }
                        return el;
                    });
                } else {
                    item[portData.portType] = toPortData.itemId;
                }
                return item;
            });
            onChange({
                ...itsRef.current,
                ...keyBy(itemsToChange, 'id')
            });
            setInitedNewPath('');
        }
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }, []);

    const onItemChange = useCallback<ComponentProps<typeof Item>['onChangeClick']>((item) => {
        onItemChangeClick?.(item);
    }, []);

    const onItemDelete = useCallback<ComponentProps<typeof Item>['onDeleteClick']>(async function(item) {
        const removeItemId = item.id;
        const confirm = await onItemDeleteClick?.(item);
        if(!confirm) {
            return;    
        }
        const changedPorts = Object.values(portsRef.current).map(port => {
            const connectedData = port.connected ? getDataFromId(port.connected) : null;
            if(connectedData?.itemId === removeItemId) {
                return {
                    ...port,
                    connected: null
                }
            }
            return port;
        }).filter(port => {
            const portData = getDataFromId(port.id);
            return portData.itemId !== removeItemId;
        });
        setPorts({
            ...keyBy(changedPorts, 'id')
        });
        // fromPairs(
        //     toPairs(portsRef.current)
        //     .filter(el => {
        //         const portData = getDataFromId(el[0]);
        //         return itemId !== portData.itemId;
        //     })
        //     .map((el) => [ el[0], el[1] ])
        // )   
        // setPorts({
        //     ...fromPairs(
        //         toPairs(portsRef.current)
        //         .filter(el => {
        //             const portData = getDataFromId(el[0]);
        //             return itemId !== portData.itemId;
        //         })
        //         .map((el) => [ el[0], el[1] ])
        //     )   
        // });
        const changedItems = Object.values(itsRef.current).map(item => {
            const outputPortData = item.output ? getDataFromId(item.output) : null;
            if(outputPortData?.itemId === removeItemId) {
                return {
                    ...item,
                    output: null
                }
            }
            if(item.outputs) {
                return {
                    ...item,
                    outputs: item.outputs.map(el => {
                        const connectedData = el.connected ? getDataFromId(el.connected) : null;
                        if(connectedData?.itemId === removeItemId) {
                            return {
                                ...el,
                                connected: null
                            }
                        }
                        return el;
                    })
                }
            }
            return item
        })
        .filter(item => {
            return item.id !== removeItemId;
        });
        onChange({
            ...keyBy(changedItems, 'id')
        });
    }, []);

    return (
        <g id={'viewport'}>
        {
            toPairs(items).map(([ _, item ]) => {
                return (
                    <Item
                        key={item.id}
                        item={item}
                        onChange={(newItem) => {
                            onChange({
                                ...itsRef.current,
                                [newItem.id]: newItem
                            });
                        }}
                        onPortMouseDown={onPortMouseDown}
                        onPortMouseUp={onPortMouseUp}
                        showChangeButton={!!onItemChangeClick}
                        onChangeClick={onItemChange}
                        showDeleteButton={!!onItemDeleteClick}
                        onDeleteClick={onItemDelete}
                    />
                );
            })
        }
            <g id='pathesRoot'>
                {
                    toPairs(ports).map(([ _, port ]) => {
                        if(!port.connected) {
                            return null;
                        }
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