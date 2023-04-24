import React, { FC, SVGAttributes, useMemo } from 'react';
import './Button.css';

const iconHeight = 22;
const iconWidth = 22;

export const Button: FC<SVGAttributes<SVGSVGElement>> = ({
    children,
    ...props
}) => {

    const y = useMemo(() => {
        let y = Number(props.y);
        if(isNaN(Number(y))) y = iconHeight / 2;
        return y - iconHeight / 2;
    }, [props.y]);

    return (
        <svg
            {...props}
            className={`Button${props.className ? ` ${props.className}` : ''}`}
            y={y}
            width={iconWidth}
            height={iconHeight}
            viewBox="0 0 30 30"
            onClick={(event) => {
                event.stopPropagation();
                props.onClick?.(event);
            }}
        >
            <rect
                x={0}
                y={0}
                width={30}
                height={30}
                fill='#003b9b'
                stroke={'#fff'}
                strokeWidth={1}
                rx={6}
                ry={6}
            />
            {
                children
            }
        </svg>
    );
};