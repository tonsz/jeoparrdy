const questionsBoard = ".board";
const questionBox = ".box";
const modalBox = ".modal";
const modalContent = ".modal-content";

let questions = [];

function showQuestion(id) {
  $(modalBox).addClass("opened");
  $(modalContent).append(`<h1>${questions[id].question}</h1>`);

  setTimeout(function () {
    $(modalContent).html("");
    $(modalBox).removeClass("opened");
  }, 2000);
}
function init() {
  // fetch the json file
  $.getJSON("./questions.json", function (data) {
    questions = data.categories;
    $.each(questions, function (index, value) {
      let qMarkup;
      let qArr = [];

      $.each(value.questions, function (index, q) {
        qArr.push(`<div class="box" id="q-${index}"> ${q.question} </div>`);
      });

      qMarkup = qArr.join("");

      console.log(qMarkup);

      const categoryTitle = `<div class="box"> ${value.category} </div>`;
      const categoryCol = `<div class="category"> ${categoryTitle} ${qMarkup} </div>`;
      $(questionsBoard).append(categoryCol);
    });
  }).then(function () {
    // assign event handlers here
  });
}

init();
