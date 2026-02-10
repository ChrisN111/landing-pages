var activeIndex = 0;
let activeIndexForSecondModal = 0;

var questionListForSecondModal = [{
    id: 1,
    englishQuestion: "What type of body turns you on?",
    question: "Welcher Körpertyp macht dich an?",
    answerList: [{
        id: 1,
        name: "Skinny",
        LangName: "Schlank"
      },
      {
        id: 2,
        name: "Curvy",
        LangName: "Kurvig"
      },
      {
        id: 3,
        name: "Regular",
        LangName: "Normal"
      },
      {
        id: 4,
        name: "Big Boobs",
        LangName: "Große Brüste"
      },
      {
        id: 5,
        name: "Small boobs",
        LangName: "Kleine Brüste"
      },
      {
        id: 6,
        name: "Milf",
        LangName: "Milf"
      },
      {
        id: 7,
        name: "Big Round Ass",
        LangName: "Großer runder Hintern"
      },
      {
        id: 8,
        name: "Tight Small Ass",
        LangName: "Kleiner knackiger Hintern"
      },
      {
        id: 9,
        name: "Other",
        LangName: "Andere"
      },
    ],
    checkedAnswer: [],
  },

  {
    id: 2,
    englishQuestion: "What age of women fits you best?",
    question: "Welches Alter von Frauen passt am besten zu dir?",
    answerList: [{
        id: 1,
        name: "18-25",
        LangName: "18-25"
      },
      {
        id: 2,
        name: "25-32",
        LangName: "25-32"
      },
      {
        id: 3,
        name: "32-37",
        LangName: "32-37"
      },
      {
        id: 4,
        name: "37-54",
        LangName: "37-54"
      },
      {
        id: 5,
        name: "55 and above",
        LangName: "55 und älter"
      },
    ],
    checkedAnswer: [],
  },
  {
    id: 3,
    englishQuestion: "What type of relationship are you looking for?",
    question: "Welche Art von Beziehung suchst du?",
    answerList: [{
        id: 1,
        name: "One Night Stand",
        LangName: "One Night Stand"
      },
      {
        id: 2,
        name: "Fuck Buddy",
        LangName: "Fickfreundschaft"
      },
      {
        id: 3,
        name: "Discreet Affair",
        LangName: "Diskrete Affäre"
      },
      {
        id: 4,
        name: "Dating",
        LangName: "Dating"
      },
      {
        id: 5,
        name: "Marriage",
        LangName: "Heirat"
      },
    ],
    checkedAnswer: [],
  },
  {
    id: 4,
    englishQuestion: "How far are you willing to travel for sex?",
    question: "Wie weit bist du bereit für Sex zu fahren?",
    answerList: [{
        id: 1,
        name: "Within Walking Distance",
        LangName: "Fußläufig erreichbar",
      },

      {
        id: 2,
        name: "Within 10-50 Miles",
        LangName: "Innerhalb von 15-80 km",
      },
      {
        id: 3,
        name: "Same State",
        LangName: "Gleiches Bundesland"
      },
      {
        id: 4,
        name: "Doesn't Matter",
        LangName: "Egal"
      },
      {
        id: 5,
        name: "Within 2-10 Miles",
        LangName: "Innerhalb von 3-15 km",
      },
    ],
    checkedAnswer: [],
  },
];

var image = document.getElementById("image");
document.getElementById("checkBoxList").style.display = "none";
var questionList = [{
    id: 1,

    title: "WICHTIG",
    englishQuestion: "Before we can show you a list and photos of local MILFS, who are  online and ready to have sex right now, we need to ask you a few quick questions.",
    question: "Bevor wir dir eine Liste und Fotos von lokalen MILFs zeigen können, die online sind und jetzt sofort Sex haben wollen, müssen wir dir ein paar kurze Fragen stellen.",
    answer: "",
  },
  {
    id: 2,
    title: "FRAGE 1/4",

    englishQuestion: "Many of these milfs are desperate single moms and cheating wives or girlfriends looking for some fun. They could be your neighbors or someone you know. Do you agree to keep the identity of these women a secret?",
    question: "Viele dieser MILFs sind verzweifelte alleinerziehende Mütter und fremdgehende Ehefrauen oder Freundinnen, die Spaß suchen. Es könnten deine Nachbarinnen oder jemand sein, den du kennst. Stimmst du zu, die Identität dieser Frauen geheim zu halten?",
    answer: "",
  },
  {
    id: 3,
    title: "FRAGE 2/4",

    englishQuestion: 'These women have asked us to not allow men that are seeking a "relationship". They only desire sex with no strings attached. Not dating. Do you agree to this request?',
    question: "Diese Frauen haben uns gebeten, keine Männer zuzulassen, die eine 'Beziehung' suchen. Sie wollen nur Sex ohne Verpflichtungen. Kein Dating. Stimmst du dieser Bitte zu?",
    answer: "",
  },

  {
    id: 4,
    title: "FRAGE 3/4",
    englishQuestion: "Do you agree to use a condom when having sex with a partner you meet on our site if asked to do so?",
    question: "Stimmst du zu, ein Kondom zu benutzen, wenn du Sex mit einer Partnerin hast, die du auf unserer Seite triffst, falls sie darum bittet?",
    answer: "",
  },
  {
    id: 5,
    title: "FRAGE 4/4",

    englishQuestion: "Each day that you check your account you will likely have multiple sex requests from MILFs on our site, will you be comfortable with this?",
    question: "Jeden Tag, wenn du dein Konto überprüfst, wirst du wahrscheinlich mehrere Sexanfragen von MILFs auf unserer Seite haben. Bist du damit einverstanden?",
    answer: "",
  },
];

// function that handle the user response

function yesNoHandler(aggree) {

  var olderThanDescription = document.getElementById("olderThanDescription");

  var questionAndContent = document.getElementById("olderThanTitle");
  var actualQuestions = document.getElementById("actualQuestion");
  var rightButtonContainer = document.getElementById("noButtonContainer");
  var yesButton = document.getElementById("yesButton");
  if (activeIndex === 0) {
    rightButtonContainer.style.display = "none";
    yesButton.innerHTML = "WEITER";
  } else if (activeIndex > 0) {
    rightButtonContainer.style.display = "flex";
    yesButton.innerHTML = "NEIN";
  }

  activeIndex = activeIndex + 1;

  if (activeIndex <= 6 && activeIndex >= 2) {
    questionAndContent.style.fontSize = "2.9rem";
  }

  if (activeIndex <= 6 && activeIndex > 2) {
    if (aggree === 1) {
      questionList[activeIndex - 2].answer = "yes";
    } else if (aggree === -1) {
      questionList[activeIndex - 2].answer = "no";
    }
  }
  if (activeIndex >= 6) {
    olderThanDescription.style.display = "none";

    yesButton.innerHTML = "ÜBERSPRINGEN";

    if (activeIndexForSecondModal < 4) {
      questionAndContent.style.fontSize = "2.9rem";
      actualQuestions.innerHTML =
        questionListForSecondModal[activeIndexForSecondModal].question;
      id = "checkBoxList";

      let activeRadioContent =
        questionListForSecondModal[activeIndexForSecondModal];

      var sampleDom = document.createElement("div");

      var datacollect = [];

      document.getElementById("landingPageContentChoose").style.display = "block";

      if (activeIndexForSecondModal <= 3) {

        for (i = 0; i < activeRadioContent.answerList.length; i++) {
          var checkBox = document.createElement("input");
          var label = document.createElement("label");

          var checkboxContainer = document.createElement("div");

          var customCheckbox = document.createElement("label");

          customCheckbox.htmlFor = activeRadioContent.answerList[i].name;
          customCheckbox.className = "customCheckboxQuestion";

          var tickArrow = document.createElement("img");

          tickArrow.src = "check.png";
          tickArrow.className = "icons";

          customCheckbox.appendChild(tickArrow);

          var label = document.createElement("label");
          checkBox.type = "checkbox";

          checkBox.name = activeRadioContent.answerList[i].name;
          checkBox.value = activeRadioContent.answerList[i].name;

          checkBox.id = activeRadioContent.answerList[i].name;
          checkBox.className = "customCheckboxQuestion_input";
          datacollect.push(checkBox);

          label.id = activeRadioContent.answerList[i].name;
          label.name = activeRadioContent.answerList[i].name;
          label.value = activeRadioContent.answerList[i].name;
          label.className = "customCheckbox";
          label.htmlFor = activeRadioContent.answerList[i].name;
          label.textContent = activeRadioContent.answerList[i].LangName;
          checkboxContainer.appendChild(checkBox);
          checkboxContainer.appendChild(customCheckbox);
          checkboxContainer.appendChild(label);

          checkboxContainer.className = "checkbox-container";
          sampleDom.appendChild(checkboxContainer);
          sampleDom.id = "checkBoxList";
          sampleDom.className = "landingPage-top-left-olderThan-checkBoxList";
        }
      }

      datacollect.forEach((item) => {
        item.addEventListener("change", (el) => {
          if (el.target.checked) {
            questionListForSecondModal[
              activeIndexForSecondModal - 1
            ].checkedAnswer.push(el.target.name);
          }
        });
      });

      if (activeIndexForSecondModal >= 0) {
        document.getElementById("checkBoxList").replaceWith(sampleDom);

        var checkboxes = document.getElementsByClassName("checkbox-container");

        if (activeIndexForSecondModal === 1) {
          for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].style.flexBasis = "28%";
          }
        }
      }

      // to change the question content
      questionAndContent.innerHTML =
        questionListForSecondModal[activeIndexForSecondModal].question;
      activeIndexForSecondModal = activeIndexForSecondModal + 1;
    } else if (activeIndexForSecondModal >= 4) {
      questionAndContent.style.fontSize = "4rem";
      questionAndContent.innerHTML = "DANKE";
      olderThanDescription.style.display = "flex";
      olderThanDescription.innerHTML = `<div class="landingPage-top-left-olderThan-descriptionFirst-thankYou">           
      <p>Du kannst jetzt unsere Liste und Fotos von Frauen sehen, die online und bereit zum Chatten in deiner Nähe sind. Bitte halte ihre Identität geheim.</p>
                         
      <p>Klicke unten auf "Weiter", um unserer Seite beizutreten und mit MILFs in deiner Nähe zu chatten.</p>`;
      document.getElementById("landingPageContentChoose").style.display = "none";
      document.getElementById("checkBoxList").style.display = "none";
      document.getElementById("continueButtonContainer").style.display = "flex";
      rightButtonContainer.style.display = "none";
      document.getElementById("yesButtonContainer").style.display = "none";
    }
  }

  if (activeIndex <= 5) {
    questionAndContent.innerHTML = questionList[activeIndex - 1].title;
    actualQuestions.innerHTML = questionList[activeIndex - 1].question;
  }
}
