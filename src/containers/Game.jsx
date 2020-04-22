import React, { useState } from 'react'
import StartGame from '../components/StartGame'
import GameRow from '../components/gameRow'
import GameRowActive from '../components/GameRowActive'
import TheCode from '../components/TheCode'
import utils from '../utils'
import TopGame from '../components/TopGame'

// 10 Game Row,
//1 active, choose colors, when all 4 colors selected show ok button to submit
//Already selected colors, - 4 pin box with color statuses, white for right color wrong place, black right color right place (Randomize display)
//aviable Rows - no interactions
// hidden row with colors
// Create MasterMind Multi Player!!!!! One player to generate the code, others to crack, wins the player with less guess and time!!!!
// https://en.wikipedia.org/wiki/Mastermind_(board_game)

let code = []

const Game = () => {
  const [gameChoices, setGameChoices] = useState([])
  const [gameStatus, setGameStatus] = useState('notstarted')
  const [startTime, setStartTime] = useState(null)

  const startGame = () => {
    setGameStatus('started')
    setGameChoices([])
    setStartTime(Date.now())
    code = utils.generateRandomCode(4)
    console.log(code)
  }

  const handleChoice = (playerChoices) => {
    console.log(code)
    //check playerChoices with code
    const answers = playerChoices.filter(utils.onlyUnique).map((item, i) => {
      return utils.checkGuessinCode(item, i, code)
    })

    //if answers.filter[correct] == 4 Code has been cracked
    //randomize display of pins
    if (answers.filter((answerStatus) => answerStatus === 'correct').length === 4) {
      setGameStatus('codecracked')
    }
    const pins = answers
      .filter((answerStatus) => answerStatus)
      .map((answerStatus) => (answerStatus === 'correct' ? 'black' : 'white'))
      .sort(utils.sortArray)

    const newGameChoices = [...gameChoices, { colors: playerChoices, pins: pins || [] }]

    setGameChoices(newGameChoices)
  }

  return (
    <div className="GameArea">
      {gameStatus === 'notstarted' ? (
        <StartGame startGame={startGame} />
      ) : (
        <>
          <TopGame round={gameChoices.length + 1} startTime={startTime} stopTimer={gameStatus === 'codecracked'} />
          {gameChoices.map((choices, i) => (
            <GameRow key={i} choices={choices} />
          ))}
          {gameStatus !== 'codecracked' && <GameRowActive handleChoice={handleChoice} />}
          {/* <TheCode /> */}
          <TheCode key="kode" showCode={gameStatus === 'codecracked'} theCode={code} />
          {gameStatus === 'codecracked' ? (
            <div>
              Code Cracked <StartGame startGame={startGame} />
            </div>
          ) : (
            ``
          )}
        </>
      )}
    </div>
  )
}

export default Game
