import { createContext, useContext, useRef } from "react";
import { getInputId } from "../utils/utils";

export type Ports = {
    [key: string]: {
        x: number;
        y: number;
        itemId: string;
        id: string;
        width: number;
        height: number;
        connected: string | null;
    },
}

export const initialPorts: {
    ports: Ports,
    setPorts: (newPorts: Ports) => void;
} = {
    ports: {
        [getInputId('cursor')]: {
            connected: null,
            height: 10,
            id: getInputId('cursor'),
            itemId: 'cursor',
            width: 10,
            x: 0,
            y: 0
        }
    },
    setPorts: () => {}
};

export const PortsContext = createContext(initialPorts);

export const usePortsContext = () => {
    const { ports, setPorts: setPortsState } = useContext(PortsContext);
    const setPorts = useRef(setPortsState);
    return {
        ports,
        setPorts: setPorts.current 
    }
};