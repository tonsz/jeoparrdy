const questionsBoard = ".board";
const questionBox = ".box";
const modalBox = ".modal";
const modalContent = ".modal-content";
const playerMoney = "#money";

const categories = ["movies", "books", "geography", "food"];

let questions = [];
let stars = 3;
let money = 0;

function showQuestion(id) {
  let qChosen = questions[id];
  let choices = [];

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
      console.log(money);
      $(playerMoney).text(money.toString());
    } else {
      alert(`The correct answer is ${qChosen.correctAnswer}`);
    }

    // back to board
    $(modalBox).removeClass("opened");
    $(modalContent).html("");
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

  // Fetch the JSON file
  $.getJSON("./questions.json", function (data) {
    questions = data.questions;

    $.each(questions, function (index, q) {
      let questionMarkup = `<div class="q box" id="q-${index}"> ${q.amount} </div>`;
      $(`#${q.category.toLowerCase()}`).append(questionMarkup);
    });
  }).then(function () {
    $(".q.box").on("click", function (event) {
      showQuestion(event.target.id.slice(2));
    });
  });
}

init();
