import React, { FC, createRef, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { items } from './mock';
import { Dot } from './Dot';
import { Context } from './Svg';
import { convertXYtoViewPort } from './utils';
import { PathTest2 } from './Path';


export const RectTest: FC<{
    item: typeof items[keyof typeof items],
    onMove: (item: typeof items[keyof typeof items] | null) => void;
    onChange: (item: typeof items[keyof typeof items]) => void;
}> = ({
    item,
    onMove,
    onChange
}) => {

    const [state, setState] = useState({x: item.x, y: item.y});

    const ref = createRef<SVGRectElement>();
    const svgRef = createRef<SVGSVGElement>();
    const offsets = useRef([0, 0]);

    const ZoomerContext = useContext(Context);

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
        onMove({
            ...item,
            x: newX,
            y: newY
        });
    }, [onMove]);

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
    }, [onMove, onChange]);

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
                    fill="#0f0"
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
                        fill="#0f0"
                        stroke="#000"
                        strokeWidth={1}
                        onMouseDown={onMouseDown}
                    />
                    <Dot
                        portData={{
                            x: state.x + 0,
                            y: state.y + 0,
                            itemId: item.id,
                            height: 10,
                            width: 10,
                            id: `${item.id}-input`,
                            connected: item.input
                        }}
                        id={`${item.id}-input`}
                        width={10}
                        height={10}
                        x={0}
                        y={0}
                    />
                    <Dot
                        portData={{
                            x: state.x + item.width - 10,
                            y: state.y + 0,
                            itemId: item.id,
                            height: 10,
                            width: 10,
                            id: `${item.id}-output`,
                            connected: item.output && `${item.output}-input`
                        }}
                        id={`${item.id}-output`}
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
                        fill="#f00"
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
                                            fill="#f00"
                                            stroke="#000"
                                            strokeWidth={1}
                                        />
                                        <Dot
                                            portData={{
                                                x: state.x + 10 + item.width - 20 - 10,
                                                y: state.y + 50 + idx * 30 + 20,
                                                itemId: item.id,
                                                height: 10,
                                                width: 10,
                                                id: `${item.id}-output-${el.id}`,
                                                connected: el.connected &&`${el.connected}-input` 
                                            }}
                                            id={`${item.id}-output-${el.id}`}
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