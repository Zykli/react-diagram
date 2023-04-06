import React, { FC, SVGAttributes, useContext, useEffect, useMemo, useState } from "react";
import ReactDOM from 'react-dom'
import { Connector } from "./mock";
import { PortsContext } from "./Svg";

const rectsOffset = 20;

type Props = SVGAttributes<SVGPathElement> & {
    connected: Connector['connected']
};

export const PathTest2: FC<{
    fromPort: string,
    toPort: string,
} & Props> = ({
    fromPort,
    toPort,
    d,
    ...props
}) => {
    const [ cls, setCls ] = useState('path-hide');
    
    const { ports } = useContext(PortsContext);

    const d1 = useMemo(() => { 
        const fromData = ports[fromPort];
        const toData = ports[toPort];
        if(!fromData || !toData) return ''; 
        const from = {
            x: fromData.x + fromData.width,
            y: fromData.y + fromData.height / 2
        };
        const to = {
            x: toData.x,
            y: toData.y + toData.height / 2
        }
        const dt1 = `${from.x} ${from.y}`;
        
        const c1 = `${from.x + rectsOffset} ${from.y}`;

        const dt2 = `${
            [from.x, to.x].reduce((a, c) => a + c, 0) / 2
        } ${
            [from.y, to.y].reduce((a, c) => a + c, 0) / 2
        }`;
    
        const c2 = `${from.x + rectsOffset} ${from.y}`;
    
        const s = `${to.x - rectsOffset} ${to.y}`;

        const dt3 = `${to.x} ${to.y}`; 

        return `M${dt1} C ${c1}, ${c2}, ${dt2}, S ${s}, ${dt3}`;
    }, [fromPort, toPort, ports[fromPort], ports[toPort]]);

    return (
        <g>
            <path
                className={cls}
                d={d1}
                fill="none"
                strokeWidth={8}
                {...props}
                onMouseEnter={() => setCls('path-show')}
                onMouseOut={() => setCls('path-hide')}
            />
            <path
                className="path"
                d={d1}
                fill="none"
                strokeWidth={4}
                stroke="#00f"
                {...props}
                onMouseEnter={() => setCls('path-show')}
                onMouseOut={() => setCls('path-hide')}
            />
        </g>
    );
};

export const PathTest: FC<Props> = ({
    d,
    ...props
}) => {

    const [ cls, setCls ] = useState('path-hide');

    return (
        <g>  
            <path
                className={cls}
                d={d}
                fill="none"
                strokeWidth={8}
                {...props}
                onMouseEnter={() => setCls('path-show')}
                onMouseOut={() => setCls('path-hide')}
            />
            <path
                className="path"
                d={d}
                fill="none"
                strokeWidth={4}
                stroke="#00f"
                {...props}
                onMouseEnter={() => setCls('path-show')}
                onMouseOut={() => setCls('path-hide')}
            />
        </g>
    )
};