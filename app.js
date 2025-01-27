const questionsBoard = ".board";
const questionBox = ".box";
const modalBox = ".modal";
const modalContent = ".modal-content";
const playerMoney = "#money";
const starBoard = ".stars";

let categories = [];
let questions = [];
let final = "What do you call a polygon with 20 sides?";
let finalAnswer = "ICOSAGON";
let intervalId;
let seconds = 5;

function saveState(state) {
  const stateString = JSON.stringify(state);
  localStorage.setItem("state", stateString);
}

function getState() {
  const stateString = localStorage.getItem("state");
  const state = JSON.parse(stateString);
  return state;
}

function endGame() {
  let state = getState();

  $(modalContent).append(
    `<p class="sub-title">You've won: <span class="highlight">${state.game.money}</span></p><br>`
  );
  $(modalContent).append(`<p class="sub-title">Thanks for playing!</p><br>`);
  $(modalContent).append(
    `<button class="q-option btn" type="button" id="end">Play again</button>`
  );
  $("#end").on("click", () => {
    localStorage.clear();
    window.location.reload();
  });
}

function calcWager(isWinner, wagered) {
  $(modalContent).html("");
  if (isWinner) {
    $(modalContent).append(`<p class="sub-title">Congratulations!</p><br>`);
  } else {
    $(modalContent).append(
      `<p class="sub-title">Better luck next time!</p><br>`
    );
  }
  endGame();
}
function doubleMoney() {
  let state = getState();

  $(modalContent).html("");
  $(modalBox).addClass("opened");

  $(modalContent).append(`<p class="sub-title">${final}</p>`);

  $(modalContent).append(`
      <input type="text" id="finalAnswer"> 
      <p class="sub-title">Wager:</p>
      <input type="text" id="wager" > 
      <br/>
      <button class="q-option btn" type="button" id="getFinalAnswer"> 
          Submit
      </button> 
  `);

  $("#getFinalAnswer").click(function () {
    const inputString = $("#finalAnswer").val().toUpperCase();
    const wageredMoney = parseInt($("#wager").val());
    if (inputString && wageredMoney >= 0) {
      if (wageredMoney <= state.game.money) {
        if (inputString === finalAnswer) {
          state.game.money += wageredMoney;
          saveState(state);
          setTimeout(() => {
            calcWager(true, wageredMoney);
          }, 400);
        } else {
          state.game.money -= wageredMoney;
          saveState(state);
          setTimeout(() => {
            calcWager(false, wageredMoney);
          }, 400);
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: `The wagering amount must only be equal or less than your total earnings.`,
          color: "#fff",
          background: "#1e0b30",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: `Please enter your answer and wager.`,
        color: "#fff",
        background: "#1e0b30",
      });
    }
  });
}

function showFinale(isWinner) {
  let state = getState();

  $(modalContent).html("");
  $(modalBox).addClass("opened");

  if (isWinner) {
    $(modalContent).append(
      `<p class="sub-title">You won!</p><br><p class="sub-title">You answered all the questions!</p><br>`
    );
  } else {
    $(modalContent).append(
      `<p class="sub-title">You've run out of stars!</p><br>`
    );
  }

  if (state.game.money > 0) {
    $(modalContent).append(
      `<p class="sub-title">Total earnings: <span class="highlight">${state.game.money}</span></p><br>`
    );
    $(modalContent).append(
      `<div id="db" class="q-option">Double my money</div><br>`
    );
    $(modalContent).append(`<div id="ig" class="q-option">I'm good...</div>`);
  } else {
    $(modalContent).append(
      `<p class="sub-title">It's okay, refresh the page to try again.</p>`
    );
  }

  saveState(state);

  $("#db").on("click", () => {
    setTimeout(() => {
      doubleMoney();
    }, 400);
  });
  $("#ig").on("click", () => {
    setTimeout(() => {
      $(modalContent).html("");
      endGame();
    }, 400);
  });
}

function showQuestion(id) {
  let qChosen = questions[id];
  let choices = [];

  let state = getState();

  // display
  $(modalBox).addClass("opened");
  $(modalContent).append(`<p class="sub-title">${qChosen.question}</p>`);

  $.each(qChosen.choices, function (index, choice) {
    choices.push(`<div class="q-option"> ${choice} </div>`);
  });

  let chMarkup = choices.join("");
  $(modalContent).append(`<div class="choices"> ${chMarkup} </div>`);

  $(modalContent).append(`<div class="timer">${seconds}</div>`);
  const timerDiv = document.querySelector(".timer");

  if (!intervalId) {
    intervalId = setInterval(function () {
      seconds--;
      timerDiv.innerText = seconds;
      if (seconds === 0) {
        state.game.answered.push(parseInt(id));
        $(`#q-${id}`).addClass("answered");

        // restart timer
        clearInterval(intervalId);
        intervalId = null;
        seconds = 5;
        Swal.fire({
          icon: "error",
          title: `Out of time! The correct answer is ${qChosen.correctAnswer}`,
          color: "#fff",
          background: "#1e0b30",
        });
        $(".stars > .star:last-child").remove();
        state.game.stars--;
        if (state.game.stars >= 1) {
          saveState(state);
          // back to board
          $(modalBox).removeClass("opened");
          $(modalContent).html("");
        } else {
          saveState(state);
          setTimeout(() => {
            showFinale(false);
          }, 400);
        }
      }
    }, 1000);
  }

  // check answer
  $(".q-option").on("click", function (event) {
    // restart timer
    clearInterval(intervalId);
    intervalId = null;
    seconds = 5;
    timerDiv.innerText = "";

    state.game.answered.push(parseInt(id));
    $(`#q-${id}`).addClass("answered");

    if (qChosen.correctAnswer === event.target.innerText) {
      Swal.fire({
        icon: "success",
        title: "Correct!",
        color: "#e6cd65",
        background: "#1e0b30",
      });
      // money calculator
      state.game.money += qChosen.amount;
      $(playerMoney).text(state.game.money.toString());

      saveState(state);

      if (state.game.answered.length == questions.length) {
        state.game.status = "finale";
        saveState(state);
        setTimeout(() => {
          showFinale(true);
        }, 400);
      }
      // back to board
      $(modalBox).removeClass("opened");
      $(modalContent).html("");
    } else {
      Swal.fire({
        icon: "error",
        title: `The correct answer is ${qChosen.correctAnswer}`,
        color: "#fff",
        background: "#1e0b30",
      });
      $(".stars > .star:last-child").remove();
      state.game.stars--;
      if (state.game.stars >= 1) {
        saveState(state);
        // back to board
        $(modalBox).removeClass("opened");
        $(modalContent).html("");
      } else {
        state.game.status = "finale";
        saveState(state);
        setTimeout(() => {
          showFinale(false);
        }, 400);
      }
    }
  });
}

function startGame() {
  let state = getState();

  // Fetch the JSON file
  $.getJSON("./questions.json", function (data) {
    questions = data.questions;
    categories = data.categories;

    $.each(categories, function (i, category) {
      let constMarkup = `
          <div class="category" id="${category}"> 
            <div class="box cat-title">${category}</div> 
          </div>`;
      $(questionsBoard).append(constMarkup);
    });

    for (var i = 0; i < state.game.stars; i++) {
      let starMarkup = `
          <img class="star" alt ="" src="star.png" width="50" />
      `;
      $(starBoard).append(starMarkup);
    }

    $(playerMoney).text(state.game.money.toString());

    $.each(questions, function (index, q) {
      let className = "q box";
      if (state.game.answered.includes(index)) {
        className = "q box answered";
      }
      let questionMarkup = `<div class="${className}" id="q-${index}"> ${q.amount} </div>`;
      $(`#${q.category.toLowerCase()}`).append(questionMarkup);
    });
    // check if the player is in finale
    if (state.game.status === "finale") {
      if (state.game.answered.length == questions.length) {
        showFinale(true);
      } else {
        showFinale(false);
      }
    }
  }).then(function () {
    $(".bottom").css("visibility", "visible");
    $(".board").css("visibility", "visible");
    $(".money").css("visibility", "visible");

    $(".q.box:not(.answered)").on("click", function (event) {
      let qid = event.target.id.slice(2);
      showQuestion(qid);
    });
  });
}

function welcome() {
  $(modalContent).html("");
  $(modalBox).addClass("opened");

  $(modalContent).append(
    `<div class="welcome">
        <h1>Jeoparrdy!</h1>
        <p><span class=highlight>Jeoparrdy!</span> is a single-player, multiple-choice, trivia game based on the <a href="https://en.wikipedia.org/wiki/Jeopardy!" target="_blank">American television game show</a>.</p>
        <p>A player starts with 3 stars. Points are earned for correct answer and a star is deducted for every wrong answer.</p>
        <p>Ready to get the highest score? :D</p>
        <button class="q-option btn" type="button" id="startGame">Start</button>
    </div>`
  );

  $("#startGame").on("click", function (event) {
    const initialState = {
      app: {
        page: "board",
      },
      game: {
        money: 0,
        stars: 3,
        answered: [],
        status: "board",
      },
    };
    saveState(initialState);
    startGame();
    $(modalBox).removeClass("opened");
    $(modalContent).html("");
  });
}

function init() {
  if (!localStorage.getItem("state")) {
    welcome();
  } else {
    startGame();
  }
}

init();
