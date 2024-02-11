import './natoPhoneticsDisplay.css';
import React, { useMemo, useState } from 'react';
import phonetics from './phonetics.json';

export const NatoPhoneticsDisplay: React.FC = () => {
  const [word, setWord] = useState<string>("");

  const display = useMemo(() => {
    if (!word) {
      return null;
    }

    const letters = word.trim().split("");
    const words = letters.map((letter) => {
      const phonetic = (phonetics as Record<string, string>)[letter.toUpperCase()];
      return phonetic ?? letter;
    });

    return (
      <>
        <hr />
        <div className="wordDisplay">
          {words.map((word, index) => {
            return (
              <div className="word" key={index}>
                {word}
              </div>
            );
          })}
        </div>
      </>
    );
  }, [word]);

  return (
    <div>
      <div className="property inputText">
        <label>Enter your word:</label>
        <input
          value={word}
          onChange={(e) => {
            setWord(e.target.value.toUpperCase());
          }}
        />
      </div>
      {display}
    </div>
  );
};
