import { cloneDeep, fromPairs, keyBy, toPairs, flattenDeep } from "lodash";
import React, { ComponentProps, FC, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Path } from "../Path";
import { PortsContext } from "../../contexts/ports";
import { Item as ItemType } from "../../utils/types";
import { convertXYtoViewPort, getDataFromId, getInputId, prepareConnectionsFromItems } from "../../utils/utils";
import { Item } from "../Item";
import { Omit } from '../../utils/utils.types';
import { useDidUpdateEffect } from "../../utils/hooks";

export type DiagramItemsType = {[key: string]: ItemType};

export type Connections = {[key: string]: ItemType['id'] | null};

export type SvgProps = {
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

    /**
     * set items ports to center by height, don't affects to subitems ports
     */
    setMainPortsByCenter?: boolean;
};

export const SVGWithZoom: FC<Omit<SvgProps, 'loadingText' | 'isLoading' | 'className' >> = ({
    items,
    setMainPortsByCenter,
    onChange,
    onItemChangeClick,
    onItemDeleteClick,
    onDragStart,
    onDragEnd
}) => {

    const itsRef = useRef(items);
    itsRef.current = items;
    
    const { ports, changePorts, setPorts } = useContext(PortsContext);
    const portsRef = useRef(ports);
    portsRef.current = ports;

    const [ initedNewPath, setInitedNewPath ] = useState('');
    const newPathRef = useRef(initedNewPath);
    newPathRef.current = initedNewPath;

    useDidUpdateEffect(() => {
        const newPorts = flattenDeep(toPairs(items).map(([_, item]) => {
            const idOutput = `${item.id}/output`;
            const idInput = `${item.id}/input`;
            return [
                {
                    id: idInput,
                    connected: item.input && `${item.input}/output`
                },
                {
                    id: idOutput,
                    connected: item.output && `${item.output}/input`
                },
                ...(item.outputs || []).map(el => {
                    const idOutputSubitem = `${item.id}/output/${el.id}`;
                    return {
                        id: idOutputSubitem,
                        connected: el.connected && `${el.connected}/input`
                    };
                })
            ]
        }));
        const changed = newPorts.reduce((a, c) => a ? a : c.connected !== portsRef.current[c.id]?.connected, false);
        if(changed) {
            const newPortsDictionary = fromPairs(Object.values(newPorts).map(item => [item.id, item]))
            changePorts({
                ...fromPairs(toPairs(portsRef.current).map(([id, item]) => {
                    if(!newPortsDictionary[id]) return [id, item];
                    return [
                        id,
                        {
                            ...item,
                            connected: newPortsDictionary[id].connected
                        }
                    ]
                }))
            });
        }
    }, [items]);

    // useEffect(() => {
    //     console.log('ports', ports);
    // }, [ports]);

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
                        setMainPortsByCenter={setMainPortsByCenter}
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