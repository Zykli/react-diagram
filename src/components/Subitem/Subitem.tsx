import React, { FC, createRef, useMemo } from 'react';
import './Subitem.scss';
import { Port } from '../Port';
import { Connector } from '../../test2/mock';
import { getInputId, getOutputId } from '../../utils/utils';
import { ItemProps } from '../Item';
import { itemHeaderHeight, itemSubItemHeight, itemTextAreaHeight, portHeight, portWidth } from '../../utils/constanst';

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

    const portData = useMemo(() => {
        const {
            height,
            width
        } = {
            height: portHeight,
            width: portWidth
        };
        return {
            x: itemX + itemWidth - 20,
            y: itemY + itemHeaderHeight + itemTextAreaHeight + (itemSubItemHeight + 10) * position - (itemSubItemHeight / 2 - height / 2),
            itemId: itemId,
            height,
            width,
            id: getOutputId(itemId, data.id),
            connected: data.connected && getInputId(data.connected) 
        };
    }, [itemX, itemY, itemWidth, position, itemId, data.connected]);

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
                    width={portData.width}
                    height={portData.height}
                    x={itemWidth - 20 - portData.width}
                    y={itemSubItemHeight / 2 - portData.height / 2}
                />
            </svg>
        </g>
    );
};