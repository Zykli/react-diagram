import React, { FC, SVGAttributes, useCallback, useContext, useEffect, useMemo, useState } from "react";
import ClickAwayListener from 'react-click-away-listener';
import { PortsContext } from "../../contexts/ports";
import { PemovePath } from "../RemovePath";
import { convertXYtoViewPort, getInputId } from "../../utils/utils";
import './Path.css';

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

    const [ cls, setCls ] = useState('Path-hide');
    
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

        const averageX = [from.x, to.x].reduce((a, c) => a + c, 0) / 2;
        const averageY = [from.y, to.y].reduce((a, c) => a + c, 0) / 2;

        const dt2 = `${averageX} ${averageY}`;
    
        const c2 = `${from.x + rectsOffset} ${from.y}`;
    
        const s = `${to.x - rectsOffset} ${to.y}`;

        const dt3 = `${to.x} ${to.y}`; 

        return `M${dt1} C ${c1}, ${c2}, ${dt2}, S ${s}, ${dt3}`;
    }, [fromPort, toPort, ports[fromPort], ports[toPort]]);

    const [ showRemoveCoords, setShowRemoveCoords ] = useState<{ x: number, y: number } | null>(null);

    const hideRemoveButton = useCallback(() => {
        setShowRemoveCoords(null);
    }, []);

    const showRemoveButtonByClick = useCallback<NonNullable<SVGAttributes<SVGGElement>['onClick']>>((e) => {
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        let coords = convertXYtoViewPort(mouseX, mouseY);
        if(!coords) return ;
        setShowRemoveCoords({
            x: coords.x,
            y: coords.y
        });
    }, []);

    const showRemove = useMemo(() => !!showRemoveCoords, [showRemoveCoords]);

    const isInfoPath = useMemo(() => {
        return toPort === getInputId('cursor');
    }, [toPort]);

    return (
        <ClickAwayListener onClickAway={(e) => {
            showRemove && hideRemoveButton()
        }}>
            <g
                className="Path-group"
                onClick={(e) => {
                    showRemoveButtonByClick(e);
                }}
            >                
                <path
                    className={`${cls}`}
                    d={d1}
                    fill="none"
                    strokeWidth={8}
                    {...props}
                    onMouseEnter={() => !isInfoPath && setCls('Path-show')}
                    onMouseOut={() => !isInfoPath && setCls('Path-hide')}
                />
                <path
                    className="Path"
                    d={d1}
                    fill="none"
                    strokeWidth={3}
                    stroke="#7c7c7c"
                    {...props}
                    onMouseEnter={() => !isInfoPath && setCls('Path-show')}
                    onMouseOut={() => !isInfoPath && setCls('Path-hide')}
                />
                {
                    showRemove &&
                    <PemovePath 
                        onClick={() => {
                            onRemove(fromPort, toPort);
                        }}
                        x={(showRemoveCoords?.x || ports[fromPort].x + 20)}
                        y={(showRemoveCoords?.y || ports[fromPort].y) - 15}
                    />
                }
            </g>
        </ClickAwayListener>
    );
};