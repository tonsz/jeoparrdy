const questionsBoard = ".board";
const questionBox = ".box";
const modalBox = ".modal";
const modalContent = ".modal-content";
const playerMoney = "#money";
const starBoard = ".stars";

const categories = ["movies", "books", "geography", "food"];

let questions = [];
let stars = 3;
let money = 0;
let final = "What do you call a polygon with 20 sides?";
let finalAnswer = "ICOSAGON";
let answeredCount = 0;

function endGame() {
  $(modalContent).append(
    `<p class="sub-title">You've won: <span class="highlight">${money}</span></p><br>`
  );
  $(modalContent).append(`<p class="sub-title">Thanks for playing!</p><br>`);
  $(modalContent).append(
    `<button class="q-option btn" type="button" id="end">Play again</button>`
  );
  $("#end").on("click", () => {
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
      if (wageredMoney <= money) {
        if (inputString === finalAnswer) {
          money += wageredMoney;
          setTimeout(() => {
            calcWager(true, wageredMoney);
          }, 400);
        } else {
          money -= wageredMoney;
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

  if (money > 0) {
    $(modalContent).append(
      `<p class="sub-title">Total earnings: <span class="highlight">${money}</span></p><br>`
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
  console.log(id);

  // display
  $(modalBox).addClass("opened");
  $(modalContent).append(`<p class="sub-title">${qChosen.question}</p>`);

  $.each(qChosen.choices, function (index, choice) {
    choices.push(`<div class="q-option"> ${choice} </div>`);
  });

  let chMarkup = choices.join("");
  $(modalContent).append(`<div class="choices"> ${chMarkup} </div>`);

  // check answer
  $(".q-option").on("click", function (event) {
    answeredCount++;
    if (qChosen.correctAnswer === event.target.innerText) {
      Swal.fire({
        icon: "success",
        title: "Correct!",
        color: "#e6cd65",
        background: "#1e0b30",
      });
      // money calculator
      money += qChosen.amount;
      $(playerMoney).text(money.toString());

      if (answeredCount == questions.length) {
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
      if (stars > 1) {
        stars--;

        // back to board
        $(modalBox).removeClass("opened");
        $(modalContent).html("");
      } else {
        setTimeout(() => {
          showFinale(false);
        }, 400);
      }
    }
  });
}

function init() {
  $.each(categories, function (i, category) {
    let constMarkup = `
        <div class="category" id="${category}"> 
          <div class="box cat-title">${category}</div> 
        </div>`;
    $(questionsBoard).append(constMarkup);
  });

  for (var i = 0; i < stars; i++) {
    let starMarkup = `
        <img class="star" alt ="" src="star.png" width="50" />
    `;
    $(starBoard).append(starMarkup);
  }

  // Fetch the JSON file
  $.getJSON("./questions.json", function (data) {
    questions = data.questions;

    $.each(questions, function (index, q) {
      let questionMarkup = `<div class="q box" id="q-${index}"> ${q.amount} </div>`;
      $(`#${q.category.toLowerCase()}`).append(questionMarkup);
    });
  }).then(function () {
    $(".q.box:not(.answered)").on("click", function (event) {
      showQuestion(event.target.id.slice(2));
      $(`#${event.target.id}`).addClass("answered");
    });
  });
}

init();
