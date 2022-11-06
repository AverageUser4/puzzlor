import React from 'react';

export default function WelcomeScreen(props) {
  let disableButton = false;
  disableButton = 
    props.imageData.origin === 'local' && !props.imageData.dataURL ||
    props.imageData.origin === 'internet' && !props.imageData.source;
    

  function handleInput(event) {
    const { value, type } = event.target;

    props.setImageData(prev => ({
      ...prev,
      origin: type === 'radio' ? value : prev.origin,
      source: type === 'text' ? value : prev.source
    }));
  }

  function onFileChange(event) {
    const file = event.target.files[0];

    if(!file.type.startsWith('image'))
      window.alert('ATTENTION! File you provided IS NOT an IMAGE. Please, provide another file!');
    else {
      const fileReader = new FileReader();

      fileReader.addEventListener('load', (event) => {
        props.setImageData(prev => ({
          ...prev,
          dataURL: event.target.result
        }))
      });

      fileReader.readAsDataURL(file);
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    props.setIsPlaying(true);
  }

  return (
    <div className="welcome-screen">

      <h1>Puzzulor</h1>

      <p>Welcome to Puzzulor, the <span className="emphasis">ultimate</span> App for creating and solving puzzle.</p>

      <form
        onSubmit={onSubmit}
      >

        <fieldset className="welcome-screen__fieldset">

          <legend>Choose image source for your puzzle:</legend>

          <label>

            <span>Random cat image</span>

            <input 
              type="radio"
              name="image-source"
              value="cat"
              checked={props.imageData.origin === 'cat'}
              onChange={handleInput}
            />

          </label>

          <label>

            <span>Image from my device</span>

            <input 
              type="radio"
              name="image-source"
              value="local"
              checked={props.imageData.origin === 'local'}
              onChange={handleInput}
            />

          </label>

          <label>

            <span>Image from the internet</span>

            <input 
              type="radio"
              name="image-source"
              value="internet"
              checked={props.imageData.origin === 'internet'}
              onChange={handleInput}
            />

          </label>
          
        </fieldset>

        <label>

          <span>Choose an image from your device:</span>

          <input 
            type="file"
            onChange={onFileChange}
          />

        </label>

        <label>

          <span>Provide a link for your image:</span>

          <input 
            type="text"
            value={props.imageData.source}
            onChange={handleInput}
          />

        </label>

        <button 
          className={`button ${disableButton ? 'button--disabled' : ''}`}
          disabled={disableButton}
          title={disableButton ? 'Upload / provide a link for your image or choose random cat image.' : ''}
        >GO!</button>

      </form>

    </div>
  );
}