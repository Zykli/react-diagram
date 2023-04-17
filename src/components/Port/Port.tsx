import React, { FC, SVGAttributes, useContext, useEffect, useMemo } from "react";
import { Ports, PortsContext } from "../../contexts/ports";
import './Port.scss';
import { getDataFromId } from "../../utils/utils";
import { useDidUpdateEffect } from "../../utils/hooks";

type Props = SVGAttributes<SVGRectElement> & {
    gProps?: SVGAttributes<SVGGElement>;
    portData: Ports[keyof Ports],
    id: string;
    disabled?: boolean;
};

export const Port: FC<Props> = ({
    portData,
    id,
    height,
    width,
    x,
    y,
    gProps,
    disabled,
    ...props
}) => {

    const { setPorts } = useContext(PortsContext);

    const portInfo = useMemo(() => getDataFromId(id), [id]);

    useEffect(() => {
        setPorts({
            [id]: {
                ...portData,
                y: (portData.height / 2) + portData.y
            }
        });
    }, [portData.x, portData.y, portData.height]);

    useDidUpdateEffect(() => {
        if(disabled) {
            setPorts({
                [id]: {
                    ...portData,
                    connected: null
                }
            });
        }
    }, [disabled, portData]);

    return (
        <g
            {...gProps}
            onMouseDown={(e) => {
                e.stopPropagation();
                !disabled && gProps?.onMouseDown?.(e);
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
                !disabled && gProps?.onMouseUp?.(e);
            }}
        >
            <svg>
                <rect
                    id={id}
                    className={`Port${portData.connected ? ' Connected' : ''}`}
                    width={width || 10}
                    height={height || 10}
                    x={x || 0}
                    y={y || 0}
                    fill="#0f0"
                    strokeWidth={1}
                    stroke="#000"
                    {...props}
                />
            </svg>
        </g>
    );
};