import React, { FC, SVGAttributes } from 'react';
import { Button } from '../Button';

export const Trash: FC<SVGAttributes<SVGSVGElement>> = ({
    ...props
}) => {

    return (
        <Button { ...props }>
            <g fill={"#fff"} style={{ transform: 'translate(3px, 3px)' }}>
                <path d="M20,6H16V5a3,3,0,0,0-3-3H11A3,3,0,0,0,8,5V6H4A1,1,0,0,0,4,8H5V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V8h1a1,1,0,0,0,0-2ZM10,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H10Zm7,14a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V8H17Z"/>
            </g>
        </Button>
    );
};