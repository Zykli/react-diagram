import { cloneDeep, fromPairs, keyBy, toPairs } from "lodash";
import React, { ComponentProps, FC, ReactNode, createContext, createRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Value, ReactSVGPanZoom, pan } from 'react-svg-pan-zoom';
import { Path } from "../Path";
import { ZoomContext, initialZoom } from "../../contexts/zoom";
import { Ports, PortsContext, initialPorts } from "../../contexts/ports";
import { Item as ItemType } from "../../utils/types";
import { convertXYtoViewPort, getDataFromId, getInputId, getItemHeight, prepareConnectionsFromItems } from "../../utils/utils";
import { Item } from "../Item";
import './Svg.css';
import { Loader } from '../Loader';
import { Omit } from '../../utils/utils.types';
import { betweenItemsAreaIfPositionsIsZero, viewHeight } from "../../utils/constanst";
import { useRefResize } from "../../utils/hooks";

export type DiagramItemsType = {[key: string]: ItemType};

export type Connections = {[key: string]: ItemType['id'] | null};

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
    onChange: (newItems: DiagramItemsType, connections: Connections) => void;

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

    /**
     * Function for set global gragging state
     * @returns 
     */
    onDragStart?: () => void;

    /**
     * Fucntion for drop global gragging state
     * @returns 
     */
    onDragEnd?: () => void;

    className?: string;

    /**
     * loading state to show plug
     */
    isLoading?: boolean;

    loadingText?: ReactNode;
};

export const SVGReactDiagram: FC<Omit<Props, 'onDragStart' | 'onDragEnd'>> = ({
    className,
    loadingText,
    isLoading,
    ...props
}) => {

    const rootDiv = useRef<HTMLDivElement>(null);

    const Viewer = useRef<ReactSVGPanZoom>(null);

    const [inited, setInited] = useState(false);

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

    const [ width ] = useRefResize(rootDiv.current, { initialWidth: 800, initialHeight: viewHeight });

    const [ dragInited, setDragInited ] = useState(false);

    const onDragStart = useCallback(() => {
        setDragInited(true);
    }, []);

    const onDragEnd = useCallback(() => {
        setDragInited(false);
    }, []);

    const areaWidth = useMemo(() => {
        return Math.max(...toPairs(props.items).map(([_, item]) => item.x + item.width), 0);
    }, [isLoading]);
    const areaWidthRef = useRef(areaWidth);
    useEffect(() => {
        areaWidthRef.current = areaWidth;
    }, [areaWidth]);

    const areaHeigth = useMemo(() => {
        return Math.max(...toPairs(props.items).map(([_, item]) => item.y + getItemHeight(item)), 0);
    }, [isLoading]);
    const areaHeigthRef = useRef(areaHeigth);
    useEffect(() => {
        areaHeigthRef.current = areaHeigth;
    }, [areaWidth]);

    useEffect(() => {
        if(!rootDiv.current) return ;
        const width = rootDiv.current.clientWidth;
        if(areaWidthRef.current && areaHeigthRef.current) {
            Viewer.current?.pan((width - areaWidthRef.current) / 2, (viewHeight - areaHeigthRef.current) / 2 );
            setInited(true);
        }
    }, [isLoading]);

    // set items inline if all coords equals zero

    useEffect(() => {
        if(isLoading) return;
        const isZero = toPairs(props.items).reduce((a, [ _, item ]) => {
            return !a ? a : !item.x || !item.y
        }, true);
        if(isZero) {
            let nextX = 0;
            const itemsInLine = fromPairs(toPairs(props.items).map(([id, item], idx) => {
                if(!idx) return [id, item];
                const x = nextX + item.width + betweenItemsAreaIfPositionsIsZero;
                nextX = x;
                return [
                    id,
                    {
                        ...item,
                        x
                    }
                ]
            }));
            const connections = prepareConnectionsFromItems(itemsInLine);
            props.onChange(itemsInLine, connections);
        }
    }, [isLoading]);

    const widthInited = useMemo(() => {
        return rootDiv.current?.clientWidth === width;
    }, [width]);

    const loaded = useMemo(() => {
        return typeof isLoading !== undefined ? !isLoading : true;
    }, [isLoading]);

    // console.log('loaded', loaded, 'inited', inited, 'widthInited', widthInited);

    return (
        <div 
            ref={rootDiv}
            className={`ReactMultipleDiagram${dragInited ? ' DragInited' : ''}${className ? ` ${className}` : ''}`}
        >
            <PortsContext.Provider value={{ports, changePorts, setPorts}}>
                <ZoomContext.Provider value={value}>
                    {(!loaded || !inited || !widthInited) && <Loader text={loadingText}/>}
                    <ReactSVGPanZoom 
                        ref={Viewer}
                        height={viewHeight}
                        width={width}
                        tool={'auto'}
                        onChangeTool={() => {}}
                        value={value}
                        onChangeValue={(val) => setValue(val)}
                        // onZoom={e => console.log('zoom')}
                        // onPan={e => console.log('pan')}
                        // onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
                        detectAutoPan={false}
                        preventPanOutside={false}
                        disableDoubleClickZoomWithToolAuto={true}
                        customToolbar={() => <></>}
                        customMiniature={() => { return <></> }}
                        background="transparent"
                        SVGBackground="transparent"
                    >
                        <svg width={areaWidth} height={areaHeigth}>
                            <SVGWithZoom
                                {...props}
                                onDragStart={onDragStart}
                                onDragEnd={onDragEnd}
                            />
                        </svg>
                    </ReactSVGPanZoom>
                </ZoomContext.Provider>
            </PortsContext.Provider>
        </div>
    )
};

const SVGWithZoom: FC<Omit<Props, 'loadingText' | 'isLoading' | 'className' >> = ({
    items,
    onChange,
    onItemChangeClick,
    onItemDeleteClick,
    onDragStart,
    onDragEnd
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
        const newItems = {
            ...itsRef.current,
            ...keyBy(itemsToChange, 'id')
        };
        const connections = prepareConnectionsFromItems(newItems);
        onChange(newItems, connections);
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
        onDragEnd?.();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }, []);

    const onPortMouseDown: ComponentProps<typeof Item>['onPortMouseDown'] = useCallback((portId, e) => {
        const fromPort = portsRef.current[portId];
        const fromPortData = getDataFromId(portId.toString());
        if(!fromPort.connected && fromPortData.portType !== 'input') {
            onDragStart?.();
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
        if(toPortData.portType === 'output' || fromPortData.itemId === toPortData.itemId) {
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
            const newItems = {
                ...itsRef.current,
                ...keyBy(itemsToChange, 'id')
            };
            const connections = prepareConnectionsFromItems(newItems);
            onChange(newItems, connections);
            setInitedNewPath('');
        }
        onDragEnd?.();
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
        const newItems = {
            ...itsRef.current,
            ...keyBy(changedItems, 'id')
        };
        const connections = prepareConnectionsFromItems(newItems);
        onChange(newItems, connections);
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
                            const newItems = {
                                ...itsRef.current,
                                [newItem.id]: newItem
                            };
                            const connections = prepareConnectionsFromItems(newItems);
                            onChange(newItems, connections);
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