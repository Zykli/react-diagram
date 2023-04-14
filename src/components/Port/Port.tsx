import React, { FC, SVGAttributes, useContext, useEffect } from "react";
import { Ports, PortsContext } from "../../contexts/ports";
import './Port.css';

type Props = SVGAttributes<SVGRectElement> & {
    gProps?: SVGAttributes<SVGGElement>;
    portData: Ports[keyof Ports],
    id: string;
};

export const Port: FC<Props> = ({
    portData,
    id,
    height,
    width,
    x,
    y,
    gProps,
    ...props
}) => {

    const { setPorts } = useContext(PortsContext);

    useEffect(() => {
        setPorts({
            [id]: {
                ...portData,
                y: 5 + portData.y
            }
        });
    }, [portData.x, portData.y]);

    return (
        <g
            {...gProps}
            onMouseDown={(e) => {
                e.stopPropagation();
                gProps?.onMouseDown?.(e);
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
                gProps?.onMouseUp?.(e);
            }}
        >
            <svg y={5}>
                <rect
                    id={id}
                    className="Port"
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