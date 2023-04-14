import { createContext, useContext, useRef } from "react";

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
    ports: {},
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