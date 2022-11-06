import React from 'react';
import ReactDOM from 'react-dom/client';

import './App.css';
import App from './App';

const root = ReactDOM.createRoot(window.root);
root.render(<App/>);

// const cat = new Image();
// cat.addEventListener('load', () => {
//   const horizontal = 3;
//   const vertical = 3;

//   const pieceWidth = cat.width / horizontal;
//   const pieceHeight = cat.height / vertical;

//   for(let i = 0; i < horizontal; i++) {
//     for(let j = 0; j < vertical; j++) {
//       const canvas = document.createElement('canvas');
//       const context = canvas.getContext('2d');

//       canvas.width = pieceWidth;
//       canvas.height = pieceHeight;
  
//       context.drawImage(cat, -pieceWidth * i, -pieceHeight * j);
//       window.root.append(canvas);
//     }
//   }

//   window.root.append(cat);
// });

// cat.src="https://cataas.com/cat";

