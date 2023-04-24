import React, { FC, createRef, useMemo } from 'react';
import { Port } from '../Port';
import { Connector } from '../../utils/types';
import { getInputId, getOutputId } from '../../utils/utils';
import { ItemProps } from '../Item';
import { itemHeaderHeight, itemSubItemHeight, itemTextAreaHeight, portHeight, portWidth } from '../../utils/constanst';
import './Subitem.css';

type Props = Pick<ItemProps, 'onPortMouseDown' | 'onPortMouseUp'> &{
    itemId: string;
    itemWidth: number;
    itemX: number;
    itemY: number;
    position: number;
    data: Connector;
};

export const Subitem: FC<Props> = ({
    itemId,
    itemWidth,
    itemX,
    itemY,
    position,
    data,
    onPortMouseDown,
    onPortMouseUp
}) => {

    const subRef = createRef<SVGRectElement>();

    const outputPortParams = useMemo(() => {
        return {
            x: itemWidth - 20 - portWidth,
            y: itemSubItemHeight / 2 - portHeight / 2,
            height: portHeight,
            width: portWidth
        }
    }, []);

    const portData = useMemo(() => {
        return {
            ...outputPortParams,
            x: itemX + outputPortParams.x + 10,
            y: itemY + itemHeaderHeight + itemTextAreaHeight + position * (itemSubItemHeight + 10) + outputPortParams.y,
            itemId: itemId,
            id: getOutputId(itemId, data.id),
            connected: data.connected && getInputId(data.connected) 
        };
    }, [itemX, itemY, itemWidth, position, itemId, data.connected, outputPortParams]);

    const textProps = useMemo(() => {
        return {
            x: 5,
            y: 4,
            height: itemSubItemHeight - 10,
            width: itemWidth - 20 - 20
        };
    }, []);

    return (
        <g
            className={'Subitem'}
        >
            <svg
                x={10}
                y={itemHeaderHeight + itemTextAreaHeight + position * (itemSubItemHeight + 10)}
            >
                <rect
                    className={'rect'}
                    ref={subRef}
                    width={itemWidth - 20}
                    height={itemSubItemHeight}
                    x={0}
                    y={0}
                    rx={4}
                    ry={4}
                    fill="#fff"
                    stroke="#000"
                    strokeWidth={1}
                />
                <foreignObject
                    {...textProps}
                >
                    <div
                        style={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            textAlign: 'left'
                        }}
                    >
                        {data.text}
                    </div>
                </foreignObject>
                <Port
                    gProps={{
                        onMouseDown: (e) => {
                            onPortMouseDown(portData.id, e)
                        },
                        onMouseUp: (e) => {
                            onPortMouseUp(portData.id, e)
                        }
                    }}
                    portData={portData}
                    id={portData.id}
                    width={outputPortParams.width}
                    height={outputPortParams.height}
                    x={outputPortParams.x}
                    y={outputPortParams.y}
                />
            </svg>
        </g>
    );
};