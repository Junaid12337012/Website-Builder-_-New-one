// Generate a simple colored placeholder with text
export const createPlaceholder = (width = 100, height = 100, bgColor = '1a1a2e', text = '', textColor = 'ffffff') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = `#${bgColor}`;
  ctx.fillRect(0, 0, width, height);
  
  // Add text if provided
  if (text) {
    ctx.fillStyle = `#${textColor}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Adjust font size based on canvas size
    const fontSize = Math.min(width / (text.length * 0.5), height * 0.5);
    ctx.font = `bold ${fontSize}px Arial`;
    
    // Draw text
    ctx.fillText(text, width / 2, height / 2);
  }
  
  return canvas.toDataURL();
};

// Predefined placeholders
export const placeholders = {
  shopify: (size = '100x40') => createPlaceholder(100, 40, '1a1a2e', 'Shopify', 'ffffff'),
  googleAnalytics: (size = '100x40') => createPlaceholder(100, 40, '1a1a2e', 'Google Analytics', 'ffffff'),
  stripe: (size = '100x40') => createPlaceholder(100, 40, '1a1a2e', 'Stripe', 'ffffff'),
  portfolioPro: (size = '400x300') => createPlaceholder(400, 300, '1a1a2e', 'Portfolio Pro', 'ffffff'),
  mailchimp: (size = '100x40') => createPlaceholder(100, 40, '1a1a2e', 'Mailchimp', 'ffffff'),
  zapier: (size = '100x40') => createPlaceholder(100, 40, '1a1a2e', 'Zapier', 'ffffff'),
  eStore: (size = '400x300') => createPlaceholder(400, 300, '0f3460', 'E-Store', 'ffffff'),
  businessPlus: (size = '400x300') => createPlaceholder(400, 300, '16213e', 'Business Plus', 'ffffff'),
  blogger: (size = '400x300') => createPlaceholder(400, 300, '533483', 'Blogger', 'ffffff'),
};

export default placeholders;
