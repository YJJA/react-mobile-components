import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  file?: File;
}

const imageType = /image.*/;

export const Image: React.FC<ImageProps> = ({ src, file, ...props }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (src) {
      setUrl(src);
      return;
    }

    if (!file) {
      return;
    }

    if (!file.type.match(imageType)) {
      console.warn('File Type not supported!');
      return;
    }

    if (!window.FileReader) {
      console.warn('FileReader not supported!');
      return;
    }

    const reader = new window.FileReader();
    reader.onload = function onload(e) {
      if (typeof reader.result === 'string') {
        setUrl(reader.result);
      }
    };

    reader.readAsDataURL(file);
  }, [src, file]);

  return <Img src={url} {...props} />;
};
