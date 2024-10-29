/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const { useState, useEffect } = React;

// An array of words for the game
const words = ["example", "program", "scramble", "react", "coding", "storage", "component", "function", "javascript", "frontend"];

function App() {
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [remainingWords, setRemainingWords] = useState([...words]);
  const [message, setMessage] = useState("");
  const [passes, setPasses] = useState(3);

  // Load game progress from local storage when the component mounts
  useEffect(() => {
    const savedPoints = localStorage.getItem("points");
    const savedStrikes = localStorage.getItem("strikes");
    const savedWords = localStorage.getItem("remainingWords");
    const savedPasses = localStorage.getItem("passes");

    if (savedPoints && savedStrikes && savedWords && savedPasses) {
      setPoints(Number(savedPoints));
      setStrikes(Number(savedStrikes));
      setRemainingWords(JSON.parse(savedWords));
      setPasses(Number(savedPasses));
    }
    // Start with a scrambled word
    newScrambledWord();
  }, []);

  // Save progress to local storage on every relevant state change
  useEffect(() => {
    localStorage.setItem("points", points);
    localStorage.setItem("strikes", strikes);
    localStorage.setItem("remainingWords", JSON.stringify(remainingWords));
    localStorage.setItem("passes", passes);
  }, [points, strikes, remainingWords, passes]);

  // Function to get a new scrambled word
  function newScrambledWord() {
    if (remainingWords.length > 0) {
      const word = remainingWords[0];
      setCurrentWord(shuffle(word));
    } else {
      endGame();
    }
  }

  // Handle the guess submission
  function handleGuess() {
    if (input.toLowerCase() === remainingWords[0].toLowerCase()) {
      setMessage("Correct!");
      setPoints(points + 1);
      setRemainingWords(remainingWords.slice(1));
      newScrambledWord();
    } else {
      setMessage("Incorrect. Try again!");
      setStrikes(strikes + 1);
      if (strikes + 1 >= 3) endGame();
    }
    setInput("");
  }

  // Pass the current word
  function handlePass() {
    if (passes > 0) {
      setRemainingWords(remainingWords.slice(1));
      setPasses(passes - 1);
      setMessage("Word skipped.");
      newScrambledWord();
    } else {
      setMessage("No passes left.");
    }
  }

  // End the game and clear local storage
  function endGame() {
    setMessage("Game Over! Your score: " + points);
    localStorage.clear();
  }

  // Reset the game
  function resetGame() {
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setRemainingWords([...words]);
    setMessage("");
    newScrambledWord();
  }

  return (
    <div>
      <h1>Scramble Game</h1>
      <p>Guess the word: {currentWord}</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleGuess()}
      />
      <button onClick={handleGuess}>Submit Guess</button>
      <button onClick={handlePass}>Pass</button>
      <button onClick={resetGame}>Play Again</button>
      <p>{message}</p>
      <p>Points: {points}</p>
      <p>Strikes: {strikes}</p>
      <p>Passes Left: {passes}</p>
    </div>
  );
}

// Render the App component
ReactDOM.render(<App />, document.getElementById("root"));
