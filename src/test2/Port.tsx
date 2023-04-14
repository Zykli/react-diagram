import React, { FC, SVGAttributes, useContext, useEffect } from "react";
import { Ports, PortsContext } from "./Svg";

type Props = SVGAttributes<SVGRectElement> & {
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
        <g>
            <svg y={5}>
                <rect
                    id={id}
                    className="rectOutput"
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