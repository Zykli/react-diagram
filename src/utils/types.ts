export type Connector = {
    id: string;
    connected: string | null;
}

export type Item = {
    id: string,
    type: 'rect' | 'path'
    x: number,
    y: number,
    height: number,
    width: number,
    items?: Item[],
    input: string | null;
    output: string | null;
    outputs?: Connector[];
    inputs?: Connector[];
};