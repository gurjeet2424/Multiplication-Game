const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');

const startForm = document.getElementById('start-form');
const radioContainer = document.querySelectorAll('.radio-container');
const inputEl = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');

const countDown = document.querySelector('.countdown');

const itemContainer = document.querySelector('.item-container');

const baseTimeEl = document.querySelector('.base-time');
const finalTimeEl = document.querySelector('.final-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgain = document.querySelector('.play-again');


let questionAmount = 0;
let firstNumber = 0;
let secondNumber = 0;
let equationsArray = [];
let equationsObj = {};
let wrongFormat = [];
let playerGuessArray = [];
let bestScoreArray = [];
let valueY = 0;

let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

function bestScoresToDOM(){
    bestScores.forEach((bestscore,index) => {
        const BestScore = bestscore;
        BestScore.textContent = `${bestScoreArray[index].bestScore}s`;
    });
}

function getSavedBestScores(){
    if(localStorage.getItem('bestScores')){
        bestScoreArray = JSON.parse(localStorage.getItem('bestScores'));
    }
    else{
        bestScoreArray = [
            { questions: 10 , bestScore: finalTimeDisplay },
            { questions: 25 , bestScore: finalTimeDisplay },
            { questions: 50 , bestScore: finalTimeDisplay },
            { questions: 99 , bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
 }
bestScoresToDOM();
}

function updateBestScores(){
    bestScoreArray.forEach((score, index)=>{
        if(questionAmount == score.questions){
            const savedBestScores = Number(bestScoreArray[index].bestScore);

            if(savedBestScores === 0 || savedBestScores > finalTime){
                bestScoreArray[index].bestScore = finalTimeDisplay;
            }
        }
    });
    bestScoresToDOM();
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

function playGameAgain(){
    gamePage.addEventListener('click', startTimer);
    scorePage.hidden = true;
    splashPage.hidden = false;
    equationsArray = [];
    playerGuessArray = [];
    valueY = 0;
    playAgain.hidden = true;
}



function showScorePage(){
    setTimeout(() => {
        playAgain.hidden = false;
    }, 1000);

    gamePage.hidden = true;
    scorePage.hidden = false;
}

function scoresToDOM(){
    finalTimeDisplay = finalTime.toFixed(1);
    baseTime = timePlayed.toFixed(1);
    penaltyTime = penaltyTime.toFixed(1);
    finalTimeEl.textContent = `Final Time:${finalTimeDisplay}s`;
    baseTimeEl.textContent = `Base Time: ${baseTime}s`;
    penaltyTimeEl.textContent = `Penalty Time:+${penaltyTime}s`;
    updateBestScores();
    itemContainer.scrollTo({ top:0, behavior: 'instant'});
    showScorePage();
}

function checkTime(){
    if(playerGuessArray.length == questionAmount){
        clearInterval(timer);
        
        equationsArray.forEach((equation, index) => {
            if(equation.evaluated === playerGuessArray[index]){

            }
            else{
                penaltyTime += 0.5;
            }
        });
        finalTime = timePlayed + penaltyTime;
        scoresToDOM();
    }
}

function addTime(){
    timePlayed += 0.1;
    checkTime();
}

function startTimer(){
    timePlayed = 0;
    penaltyTime = 0;
    finalTime = 0;
    timer = setInterval(addTime, 100);
    gamePage.removeEventListener('click', startTimer);
}

function select(playerGuess){
    valueY += 65;
    itemContainer.scroll(0,valueY);
    return playerGuess ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

function showGamePage(){
    countdownPage.hidden = true;
    gamePage.hidden = false;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function createEquations(){
      const correctEquations = getRandomInt(questionAmount);
      const incorrectEquations = questionAmount - correctEquations;
      
      for(i = 0; i < correctEquations; i++){
          firstNumber = getRandomInt(9);
          secondNumber = getRandomInt(9);
          const equationValue = firstNumber * secondNumber;
          const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
          equationsObj = {value: equation, evaluated: 'true'};
          equationsArray.push(equationsObj);
      }
      for(i = 0; i < incorrectEquations; i++){
          firstNumber = getRandomInt(9);
          secondNumber = getRandomInt(9);
          const equationValue = firstNumber * secondNumber;
          wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
          wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue + 1}`;
          wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
          const formatChoice = getRandomInt(3);
          const equation = wrongFormat[formatChoice];
          equationsObj = {value:equation, evaluated:'false'};
          equationsArray.push(equationsObj);
      }
      shuffle(equationsArray);
  }

function equationsToDOM(){
    equationsArray.forEach((equation) => {
        const item = document.createElement('div');
        item.classList.add('item');
        const equationText = document.createElement('h1');
        equationText.textContent = equation.value;
        item.appendChild(equationText);
        itemContainer.appendChild(item);
    });
}

function populateGamePage(){
    itemContainer.textContent = '';
    const topSpacer = document.createElement('div');
    topSpacer.classList.add('height-240');
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('selected-item');
    itemContainer.append(topSpacer, selectedItem);

    createEquations();
    equationsToDOM();

    const bottomSpacer = document.createElement('div');
    bottomSpacer.classList.add('height-200');
    itemContainer.appendChild(bottomSpacer);
}

function countdownStart(){
    countDown.textContent = '3';
    setTimeout(() => {
        countDown.textContent  ='2';
    }, 1000);
    setTimeout(() => {
        countDown.textContent  ='1';
    }, 2000);
    setTimeout(() => {
        countDown.textContent  ='GO!';
    }, 3000);
}


function showCountdown(){
    splashPage.hidden = true;
    countdownPage.hidden = false;
    countdownStart();
    populateGamePage();
    setTimeout(showGamePage, 4000);
}


function getRadioValue(){
    let radioValue;
    inputEl.forEach((input) => {
        if(input.checked){
            radioValue = input.value;
        }
    });
    return radioValue;

}

function selectQuestionAmount(e){
    e.preventDefault();
    questionAmount = getRadioValue();
    if(questionAmount){
    showCountdown();
    }
}


startForm.addEventListener('click', ()=>{
    radioContainer.forEach((radio) => {
        radio.classList.remove('selected-label');
        if(radio.children[1].checked){
            radio.classList.add('selected-label');
        }
    });
});

startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

getSavedBestScores();