import React, { FC, createRef, useCallback, useContext, useRef, useState } from 'react';
import { items } from '../../test2/mock';
import { ZoomContext } from '../../contexts/zoom';
import { convertXYtoViewPort, getInputId, getOutputId } from '../../utils/utils';
import { Port } from '../Port';
import { Ports } from '../../contexts/ports';


export const Item: FC<{
    item: typeof items[keyof typeof items],
    onChange: (item: typeof items[keyof typeof items]) => void;
    onPortMouseDown: (item: keyof Ports, e: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onPortMouseUp: (item: keyof Ports, e: React.MouseEvent<SVGGElement, MouseEvent>) => void;
}> = ({
    item,
    onChange,
    onPortMouseDown,
    onPortMouseUp
}) => {

    const [state, setState] = useState({x: item.x, y: item.y});

    const ref = createRef<SVGRectElement>();
    const svgRef = createRef<SVGSVGElement>();
    const offsets = useRef([0, 0]);

    const ZoomerContext = useContext(ZoomContext);

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
                    height={item.height}
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
                        height={20}
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
                                onPortMouseDown(getInputId(item.id), e)
                            },
                            onMouseUp: (e) => {
                                onPortMouseUp(getInputId(item.id), e)
                            }
                        }}
                        portData={{
                            x: state.x + 0,
                            y: state.y + 0,
                            itemId: item.id,
                            height: 10,
                            width: 10,
                            id: getInputId(item.id),
                            connected: item.input
                        }}
                        id={getInputId(item.id)}
                        width={10}
                        height={10}
                        x={0}
                        y={0}
                    />
                    <Port
                        gProps={{
                            onMouseDown: (e) => {
                                onPortMouseDown(getOutputId(item.id), e)
                            },
                            onMouseUp: (e) => {
                                onPortMouseUp(getOutputId(item.id), e)
                            }
                        }}
                        portData={{
                            x: state.x + item.width - 10,
                            y: state.y + 0,
                            itemId: item.id,
                            height: 10,
                            width: 10,
                            id: getOutputId(item.id),
                            connected: item.output && getInputId(item.output)
                        }}
                        id={getOutputId(item.id)}
                        width={10}
                        height={10}
                        x={item.width - 10}
                        y={0}
                    />
                </svg>
                <g>
                    <rect
                        className={'rect'}
                        ref={ref}
                        width={item.width}
                        height={item.height - 20}
                        x={0}
                        y={20}
                        rx={4}
                        ry={4}
                        fill="#fff"
                        stroke="#000"
                        strokeWidth={1}
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                    {
                        item.outputs?.map((el, idx) => {
                            return (
                                <g key={`g-${item.id}-${el.id}`}>
                                    <svg
                                        x={10}
                                        y={50 + idx * 30}
                                    >
                                        <rect
                                            className={'rect'}
                                            ref={ref}
                                            width={item.width - 20}
                                            height={20}
                                            x={0}
                                            y={20}
                                            rx={4}
                                            ry={4}
                                            fill="#fff"
                                            stroke="#000"
                                            strokeWidth={1}
                                        />
                                        <Port
                                            gProps={{
                                                onMouseDown: (e) => {
                                                    onPortMouseDown(getOutputId(item.id, el.id), e)
                                                },
                                                onMouseUp: (e) => {
                                                    onPortMouseUp(getOutputId(item.id, el.id), e)
                                                }
                                            }}
                                            portData={{
                                                x: state.x + 10 + item.width - 20 - 10,
                                                y: state.y + 50 + idx * 30 + 20,
                                                itemId: item.id,
                                                height: 10,
                                                width: 10,
                                                id: getOutputId(item.id, el.id),
                                                connected: el.connected && getInputId(el.connected) 
                                            }}
                                            id={getOutputId(item.id, el.id)}
                                            width={10}
                                            height={10}
                                            x={item.width - 20 - 10}
                                            y={20}
                                        />
                                    </svg>
                                </g>
                            )
                        })
                    }
                </g>
            </g>
        </svg>
        </>
    );
};