import React, { ComponentProps, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { SVGReactDiagram } from './components/Diagram';
import { items8 } from './test2/mock';
import { items8 as itemsNull } from './test2/mock.null';
import { fromPairs, toPairs } from 'lodash';

const items = items8;
// const items = itemsNull;

function App() {

  const [ its, setIts ] = useState<any>({});
  const itemsRef = useRef(its);
  itemsRef.current = its;
  // const [ its, setIts ] = useState(items);

  const [ isLoading, setIsLoading ] = useState(true);

  const getData = useCallback(() => {
    setIts(items);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 2500);
  }, []);

  // useEffect(() => {
  //   setInterval(() => {
  //     setIsLoading(true);
  //     setTimeout(() => {
  //       getData();
  //     }, 2500);
  //   }, 5000);
  // }, []);

  useEffect(() => {
    console.log('newItems', its);
  }, [its]);

  const onChangeItems: ComponentProps<typeof SVGReactDiagram>['onChange'] = useCallback((newItems, connections) => {
    setIts(newItems);
  }, []);

  const drop = useCallback(() => {
    setIts(fromPairs(toPairs(itemsRef.current).map(([id, item]: [string, any]) => {
      return [
        id,
        {
          ...item,
          input: null,
          output: null,
          outputs: item?.outputs?.map(el => {
            return {
              ...el,
              connected: null
            }
          })
        }
      ];
    })));
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
      <button
        onClick={() => {
          drop();
        }}
      >
        drop
      </button>
    </div>
  );
}

export default App;
