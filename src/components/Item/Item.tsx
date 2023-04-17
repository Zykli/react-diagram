import React, { FC, createRef, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Item as ItemType } from '../../utils/types';
import { ZoomContext } from '../../contexts/zoom';
import { convertXYtoViewPort, getInputId, getOutputId } from '../../utils/utils';
import { Port } from '../Port';
import { Ports } from '../../contexts/ports';
import { Subitem } from '../Subitem';
import { itemHeaderHeight, itemTextAreaHeight, itemSubItemHeight, portHeight, portWidth } from '../../utils/constanst';

export type ItemProps = {
    item: ItemType,
    onChange: (item: ItemType) => void;
    onPortMouseDown: (item: keyof Ports, e: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onPortMouseUp: (item: keyof Ports, e: React.MouseEvent<SVGGElement, MouseEvent>) => void;
};

export const Item: FC<ItemProps> = ({
    item,
    onChange,
    onPortMouseDown,
    onPortMouseUp
}) => {

    const [state, setState] = useState({x: item.x, y: item.y});

    const ref = createRef<SVGRectElement>();
    const svgRef = createRef<SVGSVGElement>();
    const offsets = useRef([0, 0]);

    const onMouseMove = useCallback((e: MouseEvent) => {
        const [offsetX, offsetY] = offsets.current;
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        let coords = convertXYtoViewPort(mouseX, mouseY);
        if(!coords) return ;
        const newX = coords.x - offsetX;
        const newY = coords.y - offsetY;
        setState({
            x: newX,
            y: newY
        });
    }, []);

    const onMouseUp = useCallback((e: MouseEvent) => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        offsets.current = [0, 0];
        const newX = document.getElementById(item.id)?.getAttribute('x');
        const newY = document.getElementById(item.id)?.getAttribute('y');
        onChange({
            ...item,
            x: !isNaN(Number(newX)) ? Number(newX): item.x,
            y: !isNaN(Number(newY)) ? Number(newY): item.y
        });
    }, [onChange]);

    const onMouseDown = useCallback<React.MouseEventHandler<SVGRectElement>>((e) => {
        e.stopPropagation();
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        let initialDrag = convertXYtoViewPort(mouseX, mouseY);
        if(!initialDrag) return initialDrag;
        offsets.current = [
            initialDrag.x - item.x,
            initialDrag.y - item.y
        ];
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }, [item, onMouseMove, onMouseUp]);

    const inputPortParams = useMemo(() => {
        return {
            x: 0,
            y: itemHeaderHeight / 2 - portHeight / 2,
            height: portHeight,
            width: portWidth
        }
    }, []);

    const inputPortData = useMemo(() => {
        return {
            ...inputPortParams,
            x: state.x + inputPortParams.x,
            y: state.y + inputPortParams.y,
            itemId: item.id,
            id: getInputId(item.id),
            connected: item.input
        }
    }, [state.x, state.y, item.id, item.input, inputPortParams]);

    const outputPortParams = useMemo(() => {
        return {
            x: item.width - portWidth,
            y: itemHeaderHeight / 2 - portHeight / 2,
            // y: 0,
            height: portHeight,
            width: portWidth
        }
    }, []);

    const outputPortData = useMemo(() => {
        return {
            ...outputPortParams,
            x: state.x + outputPortParams.x,
            y: state.y + outputPortParams.y,
            itemId: item.id,
            id: getOutputId(item.id),
            connected: item.output && getInputId(item.output)
        }
    }, [state.x, state.y, item.width, item.id, item.output, outputPortParams]);

    const disableOutputPort = useMemo(() => {
        if(item.outputs && !item.outputs.filter(el => el.connected === null).length) {
            return true;
        }
        return false;
    }, [item.outputs]);

    const itemHeight = useMemo(() => {
        const baseHeight = itemHeaderHeight + itemTextAreaHeight;
        if(item.outputs) {
            return baseHeight + item.outputs.length * (itemSubItemHeight + 10);
        }
        return baseHeight;
    }, [item.height, item.outputs]);

    return (
        <>
        <svg
            id={item.id}
            ref={svgRef}
            x={state.x}
            y={state.y}
        >
            <g>
                <rect
                    key={'main'}
                    className={'rect'}
                    ref={ref}
                    width={item.width}
                    height={itemHeight}
                    rx={10}
                    ry={10}
                    r={10}
                    x={0}
                    y={0}
                    fill="#2e5b9f"
                    stroke="#000"
                    strokeWidth={1}
                    onMouseDown={onMouseDown}
                />
                <svg
                    x={0}
                    y={0}
                >
                    <rect
                        className={'rect'}
                        ref={ref}
                        width={item.width}
                        height={itemHeaderHeight}
                        r={10}
                        rx={4}
                        ry={4}
                        fill="#2e5b9f"
                        stroke="#000"
                        strokeWidth={1}
                        onMouseDown={onMouseDown}
                    />
                    <Port
                        gProps={{
                            onMouseDown: (e) => {
                                onPortMouseDown(inputPortData.id, e)
                            },
                            onMouseUp: (e) => {
                                onPortMouseUp(inputPortData.id, e)
                            }
                        }}
                        portData={inputPortData}
                        id={inputPortData.id}
                        width={inputPortParams.width}
                        height={inputPortParams.height}
                        x={inputPortParams.x}
                        y={inputPortParams.y}
                    />
                    <Port
                        gProps={{
                            onMouseDown: (e) => {
                                onPortMouseDown(outputPortData.id, e)
                            },
                            onMouseUp: (e) => {
                                onPortMouseUp(outputPortData.id, e)
                            }
                        }}
                        portData={outputPortData}
                        id={outputPortData.id}
                        width={outputPortParams.width}
                        height={outputPortParams.height}
                        x={outputPortParams.x}
                        y={outputPortParams.y}
                        disabled={disableOutputPort}
                    />
                </svg>
                <g
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <rect
                        className={'rect'}
                        ref={ref}
                        width={item.width}
                        height={itemHeight - itemHeaderHeight}
                        x={0}
                        y={itemHeaderHeight}
                        rx={4}
                        ry={4}
                        fill="#fff"
                        stroke="#000"
                        strokeWidth={1}
                    />
                    <g
                        x={0}
                        y={itemHeaderHeight + itemTextAreaHeight}
                    >
                        {
                            item.outputs?.map((el, idx) => {
                                return (
                                    <Subitem
                                        key={`g-${item.id}-${el.id}`}
                                        data={el}
                                        itemId={item.id}
                                        itemWidth={item.width}
                                        itemX={state.x}
                                        itemY={state.y}
                                        onPortMouseDown={onPortMouseDown}
                                        onPortMouseUp={onPortMouseUp}
                                        position={idx}
                                    />
                                );
                            })
                        }
                    </g>
                </g>
            </g>
        </svg>
        </>
    );
};