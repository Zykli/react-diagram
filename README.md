## Package to view block diagram and make new block connctions
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
    </div>
  );
}
```

### Props
| Name  | Description |
| ------------- | ------------- |
| items  | Object with items to view |
| onChagne  | fucntion (newItems) => void  |