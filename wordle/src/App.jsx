/* eslint-disable react/prop-types */
import "./App.css";
import { useState, useEffect } from "react";

const URL = "https://random-word-api.herokuapp.com/word?length=5";
const DEFAULT_GUESSES = ["", "", "", "", "", ""];

function getClassName(word, letter, i) {
  if (letter === "") return "empty";
  if (word[i] === letter) return "correct";
  if (word.includes(letter)) return "partial";
  return "wrong";
}

function WordContainer({ word, guess }) {
  const it = guess.length ? guess.split("") : ["", "", "", "", ""];
  return (
    <div className="word-container">
      {it.map((letter, i) => {
        const className = getClassName(word, letter, i);
        return (
          <div key={i} className={`letter-container ${className}`}>
            {letter || "_"}
          </div>
        );
      })}
    </div>
  );
}

function GuessesContainer({ guesses, word }) {
  return guesses.map((guess, i) => {
    return <WordContainer key={i} guess={guess} word={word}></WordContainer>;
  });
}

function GameOverContainer({ gameOver, resetGame }) {
  return (
    <div className="game-over-container">
      {gameOver && (
        <button className="reset-button" onClick={resetGame}>
          Play again?
        </button>
      )}
    </div>
  );
}

function App() {
  const [word, setWord] = useState("NO WORD");
  const [guess, setGuess] = useState("");
  const [guessIdx, setGuessIdx] = useState(0);
  const [guesses, setGuesses] = useState(DEFAULT_GUESSES);

  const gameOver = guesses.includes(word);

  const fetchWord = async () => {
    try {
      const res = await fetch(URL);
      const words = await res.json();
      setWord(words[Math.floor(Math.random() * words.length)]);
    } catch (err) {
      console.log(err);
    }
  };

  const resetGame = () => {
    setGuesses(DEFAULT_GUESSES);
    setGuess("");
    setGuessIdx(0);
    fetchWord();
  };

  const handleClick = (event) => {
    event.preventDefault();
    if (gameOver) return;
    if (guess.length !== 5) {
      alert("word must be 5 letters");
      return;
    }
    const copy = structuredClone(guesses);
    copy[guessIdx] = guess;
    setGuesses(copy);
    setGuessIdx(guessIdx + 1);
    setGuess("");
  };

  const onChangeHandler = (event) => {
    if (gameOver) return;
    setGuess(event.target.value);
  };

  useEffect(() => {
    fetchWord();
  }, []);
  return (
    <>
      <h1>Not a Wordle clone</h1>
      <GuessesContainer guesses={guesses} word={word}></GuessesContainer>
      <form className="guess-input-container">
        <input
          className="input-box"
          type="text"
          onChange={onChangeHandler}
          value={guess}
          placeholder="Enter a guess, you won't"
        />
        <button className="submit-button" type="submit" onClick={handleClick}>
          Submit guess
        </button>
      </form>
      <GameOverContainer
        gameOver={gameOver}
        resetGame={resetGame}
      ></GameOverContainer>
      <h1>{word}</h1>
    </>
  );
}

export default App;