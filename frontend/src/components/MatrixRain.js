import React, { useEffect, useState } from 'react';

const MatrixRain = () => {
  const [characters, setCharacters] = useState([]);
  
  useEffect(() => {
    // Matrix characters (hacker-style)
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*()!?/\\|{}[]<>~`^-+=;:,.";
    const screenWidth = window.innerWidth;
    const numberOfColumns = Math.floor(screenWidth / 20); // Adjust spacing
    
    // Create initial characters
    const initialCharacters = [];
    
    for (let i = 0; i < 50; i++) {
      const randomChar = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
      const randomX = Math.floor(Math.random() * screenWidth);
      const randomDelay = Math.random() * 8;
      const randomDuration = 5 + Math.random() * 10;
      
      initialCharacters.push({
        char: randomChar,
        x: randomX,
        animationDuration: `${randomDuration}s`,
        animationDelay: `${randomDelay}s`,
        opacity: Math.random() * 0.5 + 0.5, // Between 0.5 and 1
        id: i
      });
    }
    
    setCharacters(initialCharacters);
    
    // Update characters every few seconds to keep animation fresh
    const interval = setInterval(() => {
      setCharacters(prevChars => {
        return prevChars.map(char => {
          // Randomly update some characters
          if (Math.random() > 0.7) {
            return {
              ...char,
              char: matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)),
              opacity: Math.random() * 0.5 + 0.5
            };
          }
          return char;
        });
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="matrix-bg">
      {characters.map(char => (
        <div
          key={char.id}
          className="matrix-character"
          style={{
            left: `${char.x}px`,
            animationDuration: char.animationDuration,
            animationDelay: char.animationDelay,
            opacity: char.opacity
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  );
};

export default MatrixRain;
