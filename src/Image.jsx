import React from 'react';

const ImageComponent = () => {
  const imageStyle = {
    width: '400px', // You can adjust the width and height as needed
    height: '200px',
    backgroundColor: 'lightgrey',
    border: '2px dashed grey',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '20px',
    marginTop: '30px'
  };

  return (
    <div style={imageStyle}>
      Image
    </div>
  );
};

export default ImageComponent;
