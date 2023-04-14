import React, { FC, SVGAttributes, useCallback, useContext, useEffect, useMemo, useState } from "react";
import ReactDOM from 'react-dom'
import { Connector } from "./mock";
import { PortsContext } from "./Svg";
import ClickAwayListener from 'react-click-away-listener';
import { PemovePath } from "../RemovePath/RemovePath";

const rectsOffset = 20;

type Props = SVGAttributes<SVGPathElement> & {
    fromPort: string;
    toPort: string;
    onRemove: (from: Props['fromPort'], to: Props['toPort']) => void;
};

export const Path: FC<Props> = ({
    fromPort,
    toPort,
    onRemove,
    d,
    ...props
}) => {
    const [ cls, setCls ] = useState('path-hide');

    const [ showRemove, setShowRemove ] = useState(false);
    
    const { ports } = useContext(PortsContext);

    const data = useMemo(() => { 
        const fromData = ports[fromPort];
        const toData = ports[toPort];
        if(!fromData || !toData) return {
            d: '',
            average: {}
        }; 
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

        const averageX = [from.x, to.x].reduce((a, c) => a + c, 0) / 2;
        const averageY = [from.y, to.y].reduce((a, c) => a + c, 0) / 2;

        const dt2 = `${averageX} ${averageY}`;
    
        const c2 = `${from.x + rectsOffset} ${from.y}`;
    
        const s = `${to.x - rectsOffset} ${to.y}`;

        const dt3 = `${to.x} ${to.y}`; 

        return {
            d: `M${dt1} C ${c1}, ${c2}, ${dt2}, S ${s}, ${dt3}`,
            average: {
                averageX,
                averageY
            }
        };
    }, [fromPort, toPort, ports[fromPort], ports[toPort]]);

    const hideRemoveButton = useCallback(() => setShowRemove(false), []);

    return (
        <ClickAwayListener onClickAway={(e) => {
            showRemove && hideRemoveButton()
        }}>
            <g
                className="path-group"
                onClick={(e) => {
                    setShowRemove(true);
                }}
            >                
                <path
                    className={cls}
                    d={data.d}
                    fill="none"
                    strokeWidth={8}
                    {...props}
                    onMouseEnter={() => setCls('path-show')}
                    onMouseOut={() => setCls('path-hide')}
                />
                <path
                    className="path"
                    d={data.d}
                    fill="none"
                    strokeWidth={3}
                    stroke="#7c7c7c"
                    {...props}
                    onMouseEnter={() => setCls('path-show')}
                    onMouseOut={() => setCls('path-hide')}
                />
                {
                    showRemove &&
                    <PemovePath 
                        onClick={() => {
                            onRemove(fromPort, toPort);
                        }}
                        x={(data.average.averageX || ports[fromPort].x + 20)}
                        y={(data.average.averageY || ports[fromPort].y) - 15}
                    />
                }
            </g>
        </ClickAwayListener>
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
                strokeWidth={3}
                stroke="#7c7c7c"
                {...props}
                onMouseEnter={() => setCls('path-show')}
                onMouseOut={() => setCls('path-hide')}
            />
        </g>
    )
};