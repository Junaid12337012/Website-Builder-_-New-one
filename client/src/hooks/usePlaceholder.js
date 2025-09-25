import { useState, useEffect } from 'react';
import placeholders, { createPlaceholder } from '../utils/placeholders';

const usePlaceholder = (type, customText = '', size = '100x40', bgColor, textColor = 'ffffff') => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let placeholder = '';
    
    if (type && placeholders[type.toLowerCase()]) {
      placeholder = placeholders[type.toLowerCase()](size);
    } else if (customText) {
      const [width, height] = size.split('x').map(Number);
      placeholder = createPlaceholder(
        width || 100, 
        height || 100, 
        bgColor || '1a1a2e', 
        customText, 
        textColor
      );
    }
    
    setSrc(placeholder);
  }, [type, customText, size, bgColor, textColor]);

  return src;
};

export default usePlaceholder;
