const questionsBoard = ".q-board";
const questionBox = ".q-box";
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
      // TODO: change classes and restructure HTML

      const markup = `<div class="category q-box" id="q-${index}"> ${value.category} </div>`;
      $(questionsBoard).append(markup);

      //   const questions_per_category = value.questions;
      //   $.each(questions_per_category, function (index, value) {
      //     const qMarkup = `<div class="q-box" id="cq-${index}"> $${value.amount} </div>`;
      //     $(".category").append(qMarkup);
      //   });
      //   render the contents of the json file
    });
  }).then(function () {
    // assign event handlers
    // $(".q-box").on("click", function (e) {
    //   showQuestion(e.target.id.slice(2));
    // });
  });
}

init();
