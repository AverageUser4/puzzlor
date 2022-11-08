import React from 'react';

export default function Game(props) {
  const [movementData, setMovementData] = React.useState({ x: 0, y: 0, index: null });
  const [latestZIndex, setLatestZIndex] = React.useState(1);

  let src = 'https://cataas.com/cat' + `?&ignoreme=${Math.random()}`;
  if(props.imageData.origin === 'internet')
    src = props.imageData.source;
  else if(props.imageData.origin === 'local')
    src = props.imageData.dataURL;

  const [source] = React.useState(src);

  const canvasDataBufor = [];

  for(let i = 0; i < props.imageData.horizontal * props.imageData.vertical; i++) {
    const ref = React.useRef();
    const styles = {
      position: 'absolute',
      top: Math.floor(Math.random() * (innerHeight - 200)),
      left: Math.floor(Math.random() * (innerWidth - 200)),
    };

    canvasDataBufor.push({
      ref,
      styles,
      isMoveable: true,
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
  const [puzzleFields, setPuzzleFields] = React.useState([]);

  const puzzleFieldElements = puzzleFields.map(style =>
    <div 
      key={style.top + ' ' + style.left}
      className="the-game__piece-place"
      style={style}></div>
  );

  function targetElement(event, index) {
    let thisIsPatheticProgramming = false;
    
    setCanvasData((d) => {
      for(let i = 0; i < d.length; i++) {
        if(i === index && !d[i].isMoveable)
          thisIsPatheticProgramming = true;
      }

      return d;
    });

    if(thisIsPatheticProgramming)
      return;

    setMovementData({
      x: event.clientX,
      y: event.clientY,
      index
    });

    setLatestZIndex((prev) => {
      canvasData[index].ref.current.style.zIndex = prev;
      return prev + 1;
    });
  }

  React.useEffect(() => {    
    const cat = new Image();
    cat.addEventListener('load', () => {
      const xMultiplier = cat.width / cat.height;

      const maxWidth = innerHeight * 0.9;
      const maxHeight = innerHeight * 0.9;

      let imageWidth = cat.width;
      let imageHeight = cat.height;

      while(imageWidth > maxWidth || imageHeight > maxHeight) {
        imageWidth -= 50 * xMultiplier;
        imageHeight -= 50;
      }

      const pieceWidth = imageWidth / props.imageData.horizontal;
      const pieceHeight = imageHeight / props.imageData.vertical;
  
      const puzzleFieldsBuf = [];

      let k = -1;
      for(let i = 0; i < props.imageData.horizontal; i++) {
        for(let j = 0; j < props.imageData.vertical; j++) {
          k++;

          const canvas = canvasData[k].ref.current;
          const context = canvas.getContext('2d');
  
          canvas.width = pieceWidth;
          canvas.height = pieceHeight;
      
          context.drawImage(cat, -pieceWidth * i, -pieceHeight * j, imageWidth, imageHeight);

          puzzleFieldsBuf.push({
            position: 'absolute',
            top: 50 + i * pieceHeight,
            left: 50 + j * pieceWidth,
            width: pieceWidth,
            height: pieceHeight
          });
        }
      }

      setPuzzleFields(puzzleFieldsBuf);
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

      const left = parseInt(canvasData[movementData.index].ref.current.style.left);
      const top = parseInt(canvasData[movementData.index].ref.current.style.top);

      canvasData[movementData.index].ref.current.style.left = left + event.clientX - movementData.x + 'px';
      canvasData[movementData.index].ref.current.style.top = top + event.clientY - movementData.y + 'px';

      setMovementData((prev) => ({
        ...prev,
        x: event.clientX,
        y: event.clientY
      }));
    }

    function onMouseUp() {
      if(movementData.index) {
        const pieceStyle = canvasData[movementData.index].ref.current.style;
        const pieceX = parseInt(pieceStyle.left);
        const pieceY = parseInt(pieceStyle.top);
  
        const destinationX = puzzleFields[movementData.index].left;
        const destinationY = puzzleFields[movementData.index].top;
  
        if(
            Math.abs(pieceX - destinationX) <= 10 &&
            Math.abs(pieceY - destinationY) <= 10
          ) {
            canvasData[movementData.index].ref.current.style.left = destinationX + 'px';
            canvasData[movementData.index].ref.current.style.top = destinationY + 'px';
            setCanvasData(prev => prev.map((data, index) => index === movementData.index ? { ...data, isMoveable: false} : data))
        }
      }

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
        {puzzleFieldElements}
        {canvasData.map((data) => data.reactElement)}
      </div>

      <img src={source}/>

    </div>
  )
}

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