import React, { ComponentProps, useCallback, useEffect, useState } from 'react';
import './App.css';
import { SVGReactDiagram } from './components/Svg';
import { items8 } from './test2/mock';

function App() {

  const [ its, setIts ] = useState(items8);
  useEffect(() => {
      console.log('newItems', its);
  }, [its]);

  const onChangeItems: ComponentProps<typeof SVGReactDiagram>['onChange'] = useCallback((newItems) => {
    setIts(newItems);
  }, []);

  return (
    <div className="App">
      <SVGReactDiagram
        items={its}
        onChange={onChangeItems}
        onItemChangeClick={(item) => {
          console.log('item to change', item);
        }}
        onItemDeleteClick={(item) => {
          console.log('item to delete', item);
          const confirm = window.confirm('Are you sure to remove that item?');
          return confirm;
        }}
      />
    </div>
  );
}

export default App;
