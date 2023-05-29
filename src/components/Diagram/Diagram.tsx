import { fromPairs, toPairs } from "lodash";
import React, { ComponentProps, FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Value, ReactSVGPanZoom } from 'react-svg-pan-zoom';
import { ZoomContext, initialZoom } from "../../contexts/zoom";
import { Ports, PortsContext, initialPorts } from "../../contexts/ports";
import { getItemHeight, prepareConnectionsFromItems } from "../../utils/utils";
import './Diagram.css';
import { Loader } from '../Loader';
import { Omit } from '../../utils/utils.types';
import { betweenItemsAreaIfPositionsIsZero, viewHeight } from "../../utils/constanst";
import { useRefResize } from "../../utils/hooks";
import { SvgProps, SVGWithZoom } from '../Svg';
import { Menu } from '../Menu';

export const SVGReactDiagram: FC<Omit<SvgProps, 'onDragStart' | 'onDragEnd'>> = ({
    className,
    loadingText,
    isLoading,
    ...props
}) => {

    const rootDiv = useRef<HTMLDivElement>(null);

    const Viewer = useRef<ReactSVGPanZoom>(null);

    const [inited, setInited] = useState(false);

    const [value, setValue] = useState<Value>(initialZoom);
    const [ports, setPortsState] = useState<typeof initialPorts['ports']>(initialPorts.ports);
    const portsRef = useRef(ports);
    const changePorts = useCallback((newPorts: Ports) => {
        const newData = {
            ...portsRef.current,
            ...newPorts
        };
        portsRef.current = newData;
        setPortsState(newData);
    }, []);
    const setPorts = useCallback((newPorts: Ports) => {
        portsRef.current = newPorts;
        setPortsState(newPorts);
    }, []);

    const [ width, height ] = useRefResize(rootDiv.current, { initialWidth: 800, initialHeight: viewHeight });

    const [ dragInited, setDragInited ] = useState(false);

    const onDragStart = useCallback(() => {
        setDragInited(true);
    }, []);

    const onDragEnd = useCallback(() => {
        setDragInited(false);
    }, []);

    const areaWidth = useMemo(() => {
        return Math.max(...toPairs(props.items).map(([_, item]) => item.x + item.width), 0);
    }, [isLoading]);
    const areaWidthRef = useRef(areaWidth);
    useEffect(() => {
        areaWidthRef.current = areaWidth;
    }, [areaWidth]);

    const areaHeigth = useMemo(() => {
        return Math.max(...toPairs(props.items).map(([_, item]) => item.y + getItemHeight(item)), 0);
    }, [isLoading]);
    const areaHeigthRef = useRef(areaHeigth);
    useEffect(() => {
        areaHeigthRef.current = areaHeigth;
    }, [areaWidth]);

    useEffect(() => {
        if(!rootDiv.current) return ;
        const width = rootDiv.current.clientWidth;
        if(areaWidthRef.current && areaHeigthRef.current) {
            Viewer.current?.pan((width - areaWidthRef.current) / 2, (height - areaHeigthRef.current) / 2 );
            setInited(true);
        }
    }, [isLoading]);

    // set items inline if all coords equals zero

    useEffect(() => {
        if(isLoading) return;
        const isZero = toPairs(props.items).reduce((a, [ _, item ]) => {
            return !a ? a : !item.x || !item.y
        }, true);
        if(isZero) {
            let nextX = 0;
            const itemsInLine = fromPairs(toPairs(props.items).map(([id, item], idx) => {
                if(!idx) return [id, item];
                const x = nextX + item.width + betweenItemsAreaIfPositionsIsZero;
                nextX = x;
                return [
                    id,
                    {
                        ...item,
                        x
                    }
                ]
            }));
            const connections = prepareConnectionsFromItems(itemsInLine);
            props.onChange(itemsInLine, connections);
        }
    }, [isLoading]);

    const widthInited = useMemo(() => {
        return rootDiv.current?.clientWidth === width;
    }, [width]);

    const loaded = useMemo(() => {
        return typeof isLoading !== undefined ? !isLoading : true;
    }, [isLoading]);

    return (
        <div 
            ref={rootDiv}
            className={`ReactMultipleDiagram${dragInited ? ' DragInited' : ''}${className ? ` ${className}` : ''}`}
        >
            <PortsContext.Provider value={{ports, changePorts, setPorts}}>
                <ZoomContext.Provider value={value}>
                    {(!loaded || !inited || !widthInited) && <Loader text={loadingText}/>}
                    <Menu
                        rootRef={rootDiv.current}
                    />
                    <ReactSVGPanZoom 
                        ref={Viewer}
                        height={height}
                        width={width}
                        tool={'auto'}
                        onChangeTool={() => {}}
                        value={value}
                        onChangeValue={(val) => setValue(val)}
                        // onZoom={e => console.log('zoom')}
                        // onPan={e => console.log('pan')}
                        // onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
                        detectAutoPan={false}
                        preventPanOutside={false}
                        disableDoubleClickZoomWithToolAuto={true}
                        customToolbar={() => <></>}
                        customMiniature={() => { return <></> }}
                        background="transparent"
                        SVGBackground="transparent"
                    >
                        <svg width={areaWidth} height={areaHeigth}>
                            <SVGWithZoom
                                {...props}
                                onDragStart={onDragStart}
                                onDragEnd={onDragEnd}
                            />
                        </svg>
                    </ReactSVGPanZoom>
                </ZoomContext.Provider>
            </PortsContext.Provider>
        </div>
    )
};