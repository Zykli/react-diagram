import React, { ComponentProps, useCallback, useEffect, useState } from 'react';
import './App.css';
import { SVGReactDiagram } from './components/Svg';
import { items8 } from './test2/mock';
import { items8 as itemsNull } from './test2/mock.null';

const items = items8;
// const items = itemsNull;

function App() {

  const [ its, setIts ] = useState({});

  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
      setTimeout(() => {
        setIts(items);
        setIsLoading(false);
      }, 2500);
  }, []);

  useEffect(() => {
      console.log('newItems', its);
  }, [its]);

  const onChangeItems: ComponentProps<typeof SVGReactDiagram>['onChange'] = useCallback((newItems, connections) => {
    setIts(newItems);
  }, []);

  return (
    <div className="App">
      <SVGReactDiagram
        isLoading={isLoading}
        items={isLoading ? {} : its}
        onChange={onChangeItems}
        onItemChangeClick={(item) => {
          console.log('item to change', item);
        }}
        onItemDeleteClick={(item) => {
          console.log('item to delete', item);
          const confirm = window.confirm('Are you sure want to remove that item?');
          return confirm;
        }}
      />
    </div>
  );
}

export default App;
