export type Connector = {
    /**
     * id
     */
    id: string;

    /**
     * text to display
     */
    text: string;

    /**
     * connected element id
     */
    connected: string | null;
    hide?: boolean;
}

export type Item = {
    /**
     * id
     */
    id: string;

    /**
     * type only rect
     */
    type: 'rect';

    /**
     * text to item header
     */
    name: string;

    /**
     * text to item body
     */
    text: string;

    /**
     * x position
     */
    x: number;

    /**
     * y position
     */
    y: number;

    /**
     * item width
     */
    width: number;

    /**
     * connected item id
     */
    input: string | null;

    /**
     * hide input port
     */
    hideInput?: boolean;

    /**
     * connected item id
     */
    output: string | null;

    /**
     * hide output port
     */
    hideOutput?: boolean;

    /**
     * subitems array
     */
    outputs?: Connector[];
    inputs?: Connector[];
};