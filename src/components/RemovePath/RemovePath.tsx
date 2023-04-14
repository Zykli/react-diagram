import React, { FC } from 'react';
import './RemovePath.css';

type Props = {
    onClick: () => void;
    x: number;
    y: number;
};

export const PemovePath: FC<Props> = ({
    onClick,
    x,
    y
}) => {



    return (
        <g
            className='PemovePath'
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <circle
                cx={x}
                cy={y}
                r="10"
                stroke="#a7a7a7"
                strokeWidth={1}
                fill="#d3d3d3"
            />
            <line
                x1={x - 4}
                y1={y - 4}
                x2={x + 4}
                y2={y + 4}
                stroke="#000"
                strokeWidth={2}
            />
            <line
                x1={x + 4}
                y1={y - 4}
                x2={x - 4}
                y2={y + 4}
                stroke="#000"
                strokeWidth={2}
            />
        </g>
    );
};