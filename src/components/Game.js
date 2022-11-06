import React from 'react';

export default function Game(props) {
  const [movementData, setMovementData] = React.useState({ x: 0, y: 0, index: null });

  /*
    canvasData = 
    [
      {
        reactElement: ... ,
        ref: ... ,
        styles:
          {
            position, top, left
          }
      }
    ]
  */

  let src = 'https://cataas.com/cat' + `?&ignoreme=${Math.random()}`;
  if(props.imageData.origin === 'internet')
    src = props.imageData.source;
  else if(props.imageData.origin === 'local')
    src = props.imageData.dataURL;

  const canvasDataBufor = [];

  for(let i = 0; i < props.horizontal * props.vertical; i++) {
    const ref = React.useRef();
    const styles = {
      position: 'absolute',
      top: Math.floor(Math.random() * (innerHeight - 200)),
      left: Math.floor(Math.random() * (innerWidth - 200)),
    };

    canvasDataBufor.push({
      ref,
      styles,
      reactElement:
        <canvas 
          key={i}
          ref={ref}
          style={styles}
          onMouseDown={(event) => targetElement(event, i)}
        ></canvas>
    });
  }

  const [canvasData, setCanvasData] = React.useState(canvasDataBufor);


  function targetElement(event, index) {
    setMovementData({
      x: event.clientX,
      y: event.clientY,
      index
    });
  }

  React.useEffect(() => {    
    const cat = new Image();
    cat.addEventListener('load', () => {
      const pieceWidth = cat.width / props.horizontal;
      const pieceHeight = cat.height / props.vertical;
  
      let k = -1;
      for(let i = 0; i < props.horizontal; i++) {
        for(let j = 0; j < props.vertical; j++) {
          k++;

          const canvas = canvasData[k].ref.current;
          const context = canvas.getContext('2d');
  
          canvas.width = pieceWidth;
          canvas.height = pieceHeight;
      
          context.drawImage(cat, -pieceWidth * i, -pieceHeight * j);
        }
      }
    });
  
    cat.addEventListener('error', () => {
      window.alert('Unable to load image.');
    });

    cat.src = src;
  }, []);

  React.useEffect(() => {
    function onMouseMove(event) {
      if(movementData.index === null)
        return;

      // canvasData[movementData.index].styles.left = movementData.x - event.clientX;
      // canvasData[movementData.index].styles.top = movementData.y - event.clientY;

      canvasData[movementData.index].ref.current.style.left = movementData.x - event.clientX + 'px';
      canvasData[movementData.index].ref.current.style.top = movementData.y - event.clientY + 'px';
    }

    function onMouseUp() {
      setMovementData((prev) => ({
        ...prev,
        index: null
      }));
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [movementData]);


  return (
    <div className="the-game">
      
      <button
        className="button the-game__button"
        onClick={() => props.setIsPlaying(false)}
      >GO BACK!!!</button>

      <div className="the-game__puzzle-field">
        {canvasData.map((data) => data.reactElement)}
      </div>

    </div>
  )
}