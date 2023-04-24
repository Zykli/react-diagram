export type Connector = {
    id: string;
    text: string;
    connected: string | null;
}

export type Item = {
    id: string;
    type: 'rect' | 'path';
    name: string;
    text: string;
    x: number;
    y: number;
    width: number;
    items?: Item[];
    input: string | null;
    output: string | null;
    outputs?: Connector[];
    inputs?: Connector[];
};