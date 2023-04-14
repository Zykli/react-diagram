import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SVG, SVGWithZoom, SVGtest2 } from './components/Svg';
import { items } from './test2/mock';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <div style={{ padding: '0px' }}>
    <SVGWithZoom
      items={items}
    />
    {/* <SVG
      items={items}
      relations={relationsWithInOut}
    /> */}
  {/* <SvgTest 
    items={items}
    relations={relations}
  />
  <SVGRender
    items={items}
    relations={relations}
  /> */}
  {/* <App /> */}
  </div>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
