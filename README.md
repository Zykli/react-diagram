## Package to view block diagram and make blocks connections
[demo](https://zykli.github.io/react-diagram/demo/)

### install
```
npm i react-mutliple-diagram
```

### Usage
```
import React, { ComponentProps, useCallback, useEffect, useState } from 'react';
import { SVGReactDiagram, DiagramItemsType } from 'react-mutliple-diagram';

...

function App() {

  const [ items, setItems ] = useState<DiagramItemsType>({});

  useEffect(() => {
    console.log('items', items);
  }, [items]);

  const onChange: ComponentProps<typeof SVGReactDiagram>['onChange'] = useCallback((newItems) => {
    setItems(newItems);
  }, []);

  return (
    <div className="App">
      <SVGReactDiagram
        items={items}
        onChange={onChange}
      />
      onItemChangeClick={(item) => {
        console.log('item to change', item);
      }}
      onItemDeleteClick={(item) => {
        console.log('item to delete', item);
        const confirm = window.confirm('Are you sure want to remove that item?');
        return confirm;
      }}
    </div>
  );
}
```

### Props
| Name  | Description |
| ------------- | ------------- |
| items  | Object with items to view |
| onChange  | function `(newItems) => void`  |
| onItemChangeClick  | function `(item) => void` fro edit item |
| onItemDeleteClick  | function `(item) => void` for confirm delete item, need return true for delete, or false to disable delete |