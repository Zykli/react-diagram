import React, { FC, createRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Item as ItemType } from '../../utils/types';
import { ZoomContext } from '../../contexts/zoom';
import { convertXYtoViewPort, getInputId, getItemHeight, getOutputId } from '../../utils/utils';
import { Port } from '../Port';
import { Ports } from '../../contexts/ports';
import { Subitem } from '../Subitem';
import { itemHeaderHeight, itemTextAreaHeight, itemSubItemHeight, portHeight, portWidth } from '../../utils/constanst';
import { Pencil } from '../Pencil';
import { Trash } from '../Trash';
import { SvgProps } from '../Svg';

export type ItemProps = {
    item: ItemType,
    onChange: (item: ItemType) => void;
    onPortMouseDown: (item: keyof Ports, e: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onPortMouseUp: (item: keyof Ports, e: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    showChangeButton: boolean;
    onChangeClick: (item: ItemType) => void;
    showDeleteButton: boolean;
    onDeleteClick: (item: ItemType) => void;
    setMainPortsByCenter: SvgProps['setMainPortsByCenter'];
};

export const Item: FC<ItemProps> = ({
    item,
    onChange,
    onPortMouseDown,
    onPortMouseUp,
    showChangeButton,
    onChangeClick,
    showDeleteButton,
    onDeleteClick,
    setMainPortsByCenter
}) => {

    const [state, setState] = useState({x: item.x, y: item.y});
    useEffect(() => {
        if(state.x !== item.x || state.y !== item.y) {
            setState({
                x: item.x,
                y: item.y
            });
        }
    }, [item.x, item.y]);

    const ref = createRef<SVGRectElement>();
    const svgRef = createRef<SVGSVGElement>();
    const offsets = useRef([0, 0]);

    const onMouseMove = useCallback((e: MouseEvent) => {
        const [offsetX, offsetY] = offsets.current;
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        let coords = convertXYtoViewPort(mouseX, mouseY);
        if(!coords) return ;
        let newX = coords.x - offsetX;
        let newY = coords.y - offsetY;
        // if(newX < 20) newX = 20;
        // if(newY < 20) newY = 20;
        // if(newX < 0 - item.width) newX = 0 - item.width;
        // if(newY < 0 - itemHeight) newY = 0 - itemHeight;
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

    const itemHeight = useMemo(() => {
        return getItemHeight(item);
    }, [item.outputs]);

    const inputPortParams = useMemo(() => {
        const y = setMainPortsByCenter
            ? itemHeight / 2 - portHeight / 2
            : itemHeaderHeight / 2 - portHeight / 2;
        return {
            x: 1,
            y: y + 1,
            height: portHeight,
            width: portWidth
        }
    }, [itemHeight]);

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
        const y = setMainPortsByCenter
            ? itemHeight / 2 - portHeight / 2
            : itemHeaderHeight / 2 - portHeight / 2;
        return {
            x: item.width - portWidth + 1,
            y: y + 1,
            // y: 0,
            height: portHeight,
            width: portWidth
        }
    }, [itemHeight]);

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
        if(item.outputs && item.outputs.length && !item.outputs.filter(el => el.connected === null).length) {
            return true;
        }
        return false;
    }, [item.outputs]);

    const [ showButtons, setShowButtons ] = useState(false);

    const editButton = useMemo(() => {
        const ofsetY = showDeleteButton ? 60 : 35;
        return showChangeButton && showButtons ? <Pencil x={item.width - ofsetY} y={itemHeaderHeight / 2} onClick={() => onChangeClick(item)} /> : null;
    }, [showChangeButton, showDeleteButton, onChangeClick, showButtons]);

    const removeButton = useMemo(() => {
        return showDeleteButton && showButtons ? <Trash x={item.width - 35} y={itemHeaderHeight / 2} onClick={() => onDeleteClick(item)} /> : null;
    }, [showDeleteButton, onDeleteClick, showButtons]);

    const headerProps = useMemo(() => {
        return {
            x: 15,
            y: 4,
            height: itemHeaderHeight - 10,
            width: item.width - 30
        }
    }, [item.width]);

    const textProps = useMemo(() => {
        return {
            x: 10,
            y: itemHeaderHeight + 4,
            height: itemTextAreaHeight,
            width: item.width - 20
        }
    }, [item.width]);

    const InputPort = useMemo(() => {
        return item.hideInput ? null : Port;
    }, [item.hideInput]);

    const OutputPort = useMemo(() => {
        return item.hideOutput ? null : Port;
    }, [item.hideOutput]);

    return (
        <>
        <svg
            id={item.id}
            ref={svgRef}
            x={state.x}
            y={state.y}
        >
            <defs>
                <clipPath id={`round-corner-${item.id}`}>
                    <rect 
                        x={1.5}
                        y={itemHeaderHeight + 1 - 4}
                        // x={0}
                        // y={-4}
                        width={item.width - 1}
                        height={itemHeight - itemHeaderHeight + 4 - .5}
                        rx={4}
                        ry={4}
                    />
                </clipPath>
            </defs>
            <g>
                <rect
                    key={'main'}
                    className={'rect'}
                    ref={ref}
                    width={item.width}
                    height={itemHeight}
                    rx={4}
                    ry={4}
                    x={1}
                    y={1}
                    fill="#2e5b9f"
                    stroke="#000"
                    strokeWidth={1}
                    onMouseDown={onMouseDown}
                />
                <svg
                    x={0}
                    y={0}
                    onMouseEnter={() => setShowButtons(true)}
                    onMouseLeave={() => setShowButtons(false)}
                >
                    <foreignObject
                        {...headerProps}
                    >
                        <div
                            style={{
                                color: '#fff',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                textAlign: 'left',
                                pointerEvents: 'none'
                            }}
                        >
                            {item.name}
                        </div>
                    </foreignObject>
                    <rect
                        className={'rect'}
                        ref={ref}
                        width={item.width}
                        height={itemHeaderHeight}
                        r={10}
                        rx={4}
                        ry={4}
                        style={{
                            cursor: "grab"
                        }}
                        fill={'transparent'}
                        onMouseDown={onMouseDown}
                    />
                    {editButton}
                    {removeButton}
                </svg>
                <g
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <rect
                        className={'rect'}
                        width={item.width}
                        height={itemHeight - itemHeaderHeight + 5}
                        x={1}
                        y={itemHeaderHeight + 1}
                        clipPath={`url(#round-corner-${item.id})`}
                        fill={'#fff'}
                    />
                    <line x1={1} y1={itemHeaderHeight + 1} x2={item.width + 1} y2={itemHeaderHeight + 1} stroke="#000" />
                    <foreignObject
                        {...textProps}
                    >
                        <div
                            style={{
                                textAlign: 'left',
                                height: '100%',
                                overflow: 'hidden'
                            }}
                        >
                            {item.text}
                        </div>
                    </foreignObject>
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
                {
                    InputPort &&
                    <InputPort
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
                }
                {
                    OutputPort &&
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
                }
            </g>
        </svg>
        </>
    );
};