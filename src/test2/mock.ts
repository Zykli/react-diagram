export type Connector = {
    id: string;
    connected: string | null;
}

type item = {
    id: string,
    type: 'rect' | 'path'
    x: number,
    y: number,
    height: number,
    width: number,
    items?: item[],
    input: string | null;
    output: string | null;
    outputs?: Connector[];
    inputs?: Connector[];
};

const itemsWidth = 200;

export const items: {[id: item['id']]: item} = {
    "1": {
        id: "1",
        type: "rect",
        x: 21,
        y: 237,
        height: 225,
        width: itemsWidth,
        input: null,
        output: "2",
        outputs: [
            {
                id: "1",
                connected: null
            },
            {
                id: "2",
                connected: "4"
            },
            {
                id: "3",
                connected: "4"
            },
            {
                id: "4",
                connected: "3"
            },
            {
                id: "5",
                connected: null
            }
        ]
    },
    "2": {
        id: "2",
        type: "rect",
        x: 300,
        y: 70,
        height: 125,
        width: itemsWidth,
        input: null,
        output: "4",
        outputs: [
            {
                id: "1",
                connected: null
            },
            {
                id: "2",
                connected: null
            }
        ]
    },
    "3": {
        id: "3",
        type: "rect",
        x: 477,
        y: 507,
        height: 100,
        width: itemsWidth,
        input: null,
        output: null
    },
    "4": {
        id: "4",
        type: "rect",
        x: 569,
        y: 327,
        height: 100,
        width: itemsWidth,
        input: null,
        output: null
    },
    "5": {
        id: "5",
        type: "rect",
        x: 569,
        y: 327,
        height: 100,
        width: itemsWidth,
        input: null,
        output: null
    },
    "6": {
        id: "6",
        type: "rect",
        x: 569,
        y: 327,
        height: 100,
        width: itemsWidth,
        input: null,
        output: null
    },
    "7": {
        id: "7",
        type: "rect",
        x: 569,
        y: 327,
        height: 100,
        width: itemsWidth,
        input: null,
        output: null
    },
    "8": {
        id: "8",
        type: "rect",
        x: 569,
        y: 327,
        height: 100,
        width: itemsWidth,
        input: null,
        output: null
    }
};