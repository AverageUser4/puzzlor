import React from 'react';

import Game from './components/Game';
import WelcomeScreen from './components/WelcomeScreen';

export default function App() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  // dataURL which is used if origin is local
  const [imageData, setImageData] = React.useState({
    origin: 'cat',
    source: '',
    dataURL: '',
    vertical: 3,
    horizontal: 3
  });

  // console.log(imageData)

  return (
    <main>

      {isPlaying ? 
        <>
          <Game
            imageData={imageData}
            setIsPlaying={setIsPlaying}
          />
        </>
        :
        <WelcomeScreen
          imageData={imageData}
          setImageData={setImageData}
          setIsPlaying={setIsPlaying}
        />
      }

    </main>
  );
}

/*
  - add fields to put puzzles in
*/

/*
  imageData = 
  {
    origin: 'cat', 'local' or 'internet',
    source: to be used when 'internet' is set as origin,
    dataURL: to be used when 'local' is set as origin
  }

  if origin is 'cat' this is used as image https://cataas.com/cat
*/