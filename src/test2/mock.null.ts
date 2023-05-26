import { Item } from '../utils/types'

const itemsWidth = 200;

export const items: {[id: Item['id']]: Item} = {
    "1": {
        id: "1",
        type: "rect",
        name: 'Item 1',
        text: 'Description for item1',
        x: 0,
        y: 0,
        width: itemsWidth,
        input: null,
        output: "2",
        outputs: [
            {
                id: "1",
                text: "Output 1",
                connected: null
            },
            {
                id: "2",
                text: "Output 2",
                connected: "4"
            },
            {
                id: "3",
                text: "Output 3",
                connected: "4"
            },
            {
                id: "4",
                text: "Output 4",
                connected: "3"
            },
            {
                id: "5",
                text: "Output 5",
                connected: null
            }
        ]
    },
    "2": {
        id: "2",
        type: "rect",
        name: 'Item 2',
        text: 'Description for item2',
        x: 0,
        y: 0,
        width: itemsWidth,
        input: null,
        output: "4",
        outputs: [
            {
                id: "1",
                text: "Output 1",
                connected: null
            },
            {
                id: "2",
                text: "Output 2",
                connected: null
            }
        ]
    },
    "3": {
        id: "3",
        type: "rect",
        name: 'Item 3',
        text: 'Description for item3',
        x: 0,
        y: 0,
        width: itemsWidth,
        input: null,
        output: null
    },
    "4": {
        id: "4",
        type: "rect",
        name: 'Item 4',
        text: 'Description for item4',
        x: 0,
        y: 0,
        width: itemsWidth,
        input: null,
        output: null
    },
};

export const items8 = JSON.parse(JSON.stringify({
    "1": {
        "id": "1",
        "type": "rect",
        "name": 'Item 1Item 1Item 1Item 1Item 1Item 1Item 1Item 1Item 1',
        "text": 'This is a very long description. Description for item1. And much more texts add',
        "x": 0,
        "y": 0,
        "width": 200,
        "input": null,
        "output": "2",
        "outputs": [
            {
                "id": "1",
                "text": "Output 1 with long text",
                "connected": "8"
            },
            {
                "id": "2",
                "text": "Output 2",
                "connected": "4"
            },
            {
                "id": "3",
                "text": "Output 3",
                "connected": "4"
            },
            {
                "id": "4",
                "text": "Output 4",
                "connected": "3"
            },
            {
                "id": "5",
                "text": "Output 5",
                "connected": null
            }
        ]
    },
    "2": {
        "id": "2",
        "type": "rect",
        "name": 'Item 2',
        "text": 'Description for item2',
        "x": 0,
        "y": 0,
        "width": 200,
        "input": null,
        "output": null,
        "outputs": [
            {
                "id": "1",
                "text": "Output 1",
                "connected": "7"
            },
            {
                "id": "2",
                "text": "Output 2",
                "connected": "5"
            }
        ]
    },
    "3": {
        "id": "3",
        "type": "rect",
        "name": 'Item 3',
        "text": 'Description for item3',
        "x": 0,
        "y": 0,
        "width": 200,
        "input": null,
        "output": "6"
    },
    "4": {
        "id": "4",
        "type": "rect",
        "name": 'Item 4',
        "text": 'Description for item4',
        "x": 0,
        "y": 0,
        "width": 200,
        "input": null,
        "output": "5"
    },
    "5": {
        "id": "5",
        "type": "rect",
        "name": 'Item 5',
        "text": 'Description for item5',
        "x": 0,
        "y": 0,
        "width": 200,
        "input": null,
        "output": null
    },
    "6": {
        "id": "6",
        "type": "rect",
        "name": 'Item 6',
        "text": 'Description for item6',
        "x": 0,
        "y": 0,
        "width": 200,
        "input": null,
        "output": null
    },
    "7": {
        "id": "7",
        "type": "rect",
        "name": 'Item 7',
        "text": 'Description for item7',
        "x": 0,
        "y": 0,
        "width": 200,
        "input": null,
        "output": null
    },
    "8": {
        "id": "8",
        "type": "rect",
        "name": 'Item 8',
        "text": 'Description for item8',
        "x": 0,
        "y": 0,
        "width": 200,
        "input": null,
        "output": "6"
    }
}));