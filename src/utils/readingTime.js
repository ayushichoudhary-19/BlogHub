const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const textLength = text?.split(/\s+/).length;
    const readingTime = Math.ceil(textLength / wordsPerMinute);
    return readingTime;
  };
  
  export default calculateReadingTime;
  