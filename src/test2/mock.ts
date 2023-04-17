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
};

export const items8 = JSON.parse(JSON.stringify({
    "1": {
        "id": "1",
        "type": "rect",
        "x": -108.31220245361328,
        "y": 166.32937622070312,
        "height": 100,
        "width": 200,
        "input": null,
        "output": "2",
        "outputs": [
            {
                "id": "1",
                "connected": "8"
            },
            {
                "id": "2",
                "connected": "4"
            },
            {
                "id": "3",
                "connected": "4"
            },
            {
                "id": "4",
                "connected": "3"
            },
            {
                "id": "5",
                "connected": null
            }
        ]
    },
    "2": {
        "id": "2",
        "type": "rect",
        "x": 218.80398559570312,
        "y": 17.372941970825195,
        "height": 100,
        "width": 200,
        "input": null,
        "output": null,
        "outputs": [
            {
                "id": "1",
                "connected": "7"
            },
            {
                "id": "2",
                "connected": "5"
            }
        ]
    },
    "3": {
        "id": "3",
        "type": "rect",
        "x": 284.5353088378906,
        "y": 564.1378784179688,
        "height": 100,
        "width": 200,
        "input": null,
        "output": "6"
    },
    "4": {
        "id": "4",
        "type": "rect",
        "x": 572.0072631835938,
        "y": 278.88385009765625,
        "height": 100,
        "width": 200,
        "input": null,
        "output": "5"
    },
    "5": {
        "id": "5",
        "type": "rect",
        "x": 874.2368774414062,
        "y": 275.87657928466797,
        "height": 100,
        "width": 200,
        "input": null,
        "output": null
    },
    "6": {
        "id": "6",
        "type": "rect",
        "x": 645.6851196289062,
        "y": 511.946533203125,
        "height": 100,
        "width": 200,
        "input": null,
        "output": null
    },
    "7": {
        "id": "7",
        "type": "rect",
        "x": 630.6488647460938,
        "y": 20.259422302246094,
        "height": 100,
        "width": 200,
        "input": null,
        "output": null
    },
    "8": {
        "id": "8",
        "type": "rect",
        "x": 290.8283386230469,
        "y": 430.75048828125,
        "height": 100,
        "width": 200,
        "input": null,
        "output": "6"
    }
}));