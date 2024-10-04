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

function endGame() {
  $(modalContent).append(`<p class="sub-title">Brilliant! You've won:</p><br>`);
  // TODO
  $(modalContent).append(`<p class="sub-title">${money}</p><br>
  <p>The prize will be converted to...</p><br>
  <button class="q-option btn" type="button" id="claim">CLAIM</button> `);

  $("#claim").on("click", () => {
    $(playerMoney).addClass("end");
    $(questionsBoard).addClass("end");
    $(modalBox).removeClass("opened");
    $(".top").addClass("end");
    $(".endgame").addClass("opened");
  });
}
function doubleMoney() {
  $(modalBox).addClass("opened");
  $(modalContent).append(`<p class="sub-title">${final}</p>`);

  $(modalContent).append(`
      <input type="text" id="finalAnswer"> 
      <p class="sub-title">Wager:</p>
      <input type="text" id="wager"> 
      <br/>
      <button class="q-option btn" type="button" id="getFinalAnswer"> 
          Submit
      </button> 
  `);

  $("#getFinalAnswer").click(function () {
    const inputString = $("#finalAnswer").val().toUpperCase();
    const wageredMoney = $("#wager").val();
    if (wageredMoney <= money) {
      if (inputString === finalAnswer) {
        money += parseInt(wageredMoney);
        $(modalContent).html("");
        setTimeout(() => {
          endGame();
        }, 400);
      }
    } else {
      alert(
        "The wagering amount must only be equal or less than your total earnings."
      );
    }
  });
}

function showFinale() {
  $(modalBox).addClass("opened");
  $(modalContent).append(
    `<p class="sub-title">You've run out of stars!</p><br>`
  );

  if (money > 0) {
    $(modalContent).append(
      `<p class="sub-title">Total earnings: ${money}</p><br>`
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
    $(modalContent).html("");
    setTimeout(() => {
      doubleMoney();
    }, 400);
  });
  $("#ig").on("click", () => {
    $(modalContent).html("");
    setTimeout(() => {
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
    if (qChosen.correctAnswer === event.target.innerText) {
      alert("Correct!"); // must change this

      // money calculator
      money += qChosen.amount;
      $(playerMoney).text(money.toString());

      if (money >= 12000) {
        $(modalContent).html("");
        $(modalContent).append(
          `<p class="sub-title">You won!</p><br>``<p class="sub-title">I love you, my brilliant girl.</p><br>`
        );
      }
      // back to board
      $(modalBox).removeClass("opened");
      $(modalContent).html("");
    } else {
      alert(`The correct answer is ${qChosen.correctAnswer}`);
      $(".stars > .star:last-child").remove();
      if (stars > 1) {
        stars--;

        // back to board
        $(modalBox).removeClass("opened");
        $(modalContent).html("");
      } else {
        $(modalContent).html("");
        setTimeout(() => {
          showFinale();
        }, 400);
        // what happens when stars are lost
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
