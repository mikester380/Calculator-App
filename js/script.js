"use strict";

// CODE FOR CALCULATOR THEME SWITCHER

const colorScheme = document.querySelector(".color-scheme");
const themeToggle = document.querySelector(".header__theme-toggle");
const themeToggleCircle = themeToggle.querySelector(
  ".header__theme-toggle-circle"
);
const keys = document.querySelectorAll(".calculator__button");
const calculatorDisplay = document.querySelector(".calculator__view-digit");

const modes = ["light", "dark", "cyan"];
let counter = 0;
let selectedColorScheme = localStorage.getItem("theme");

if (!selectedColorScheme) {
  if (window.matchMedia("prefers-color-scheme: dark").matches) {
    colorScheme.href = "css/dark-theme.css";
  }
} else {
  colorScheme.href = `css/${localStorage.getItem("theme")}-theme.css`;
  counter = modes.indexOf(localStorage.getItem("theme"));
  themeToggleCircle.classList.add(`${modes[counter]}-circle-transition`);
}

const switchColorScheme = () => {
  themeToggleCircle.classList.remove(`${modes[counter]}-circle-transition`);
  counter = counter < modes.length - 1 ? counter + 1: 0;
  colorScheme.href = `css/${modes[counter]}-theme.css`;
  themeToggleCircle.classList.add(`${modes[counter]}-circle-transition`);
  localStorage.setItem("theme", modes[counter]);
};

themeToggle.addEventListener("click", switchColorScheme);

// CODE FOR GENERAL CALCULATOR LOGIC

const states = {};
let operators = ["+", "-", "x", "/"];

const keyPressHandler = (event) => {
  let key = event.target;
  let keyValue = key.textContent;

  if (calculatorDisplay.textContent !== "Error") {
    if (
      !key.classList.contains("operator") &&
      !key.classList.contains("delete") &&
      !key.classList.contains("equal")
    ) {
      if (operators.includes(calculatorDisplay.textContent)) {
        states.operator = calculatorDisplay.textContent;
        calculatorDisplay.textContent = "";
      }

      if (calculatorDisplay.textContent === "0") {
        calculatorDisplay.textContent = "";
      }
      calculatorDisplay.textContent += keyValue;
    } else if (key.classList.contains("operator")) {
      if (
        calculatorDisplay.textContent !== "0" &&
        calculatorDisplay.textContent !== "" &&
        !operators.includes(calculatorDisplay.textContent)
      ) {
        if (
          !isFinite(states.firstNumber) &&
          !isFinite(states.secondNumber && !operators.includes(states.operator))
        ) {
          states.firstNumber = calculatorDisplay.textContent;
          calculatorDisplay.textContent = keyValue;
        } else {
          calculate();
          states.firstNumber = calculatorDisplay.textContent.split("").filter(char => char !== ',').join("");
          states.secondNumber = undefined;
          states.operator = keyValue;
          calculatorDisplay.textContent = keyValue;
        }
      }
    }
  }
};

const backspace = () => {
  if (calculatorDisplay.textContent === 'Error') {
    calculatorDisplay.textContent = ""
  } else {
    let splitted = calculatorDisplay.textContent.split("");
    splitted.pop();
    calculatorDisplay.textContent = splitted.join("");
  }

};

const reset = () => {
  calculatorDisplay.textContent = "0";
  states.firstNumber = undefined;
  states.secondNumber = undefined;
  states.operator = undefined;
};

const calculate = () => {
  states.secondNumber = calculatorDisplay.textContent;
  if (
    isFinite(states.firstNumber) &&
    isFinite(states.secondNumber) &&
    operators.includes(states.operator)
  ) {
    states.operator = states.operator === "x" ? "*": states.operator;
    let answer = `${states.firstNumber} ${states.operator} ${states.secondNumber}`;
    answer = states.operator === '/' ? eval(answer).toFixed(2) : eval(answer);
    
    calculatorDisplay.textContent = !isFinite(answer) ? "Error": Intl.NumberFormat('en-US').format(answer);
    states.secondNumber = undefined;
    states.operator = "";
  }
};

keys.forEach((key) => {
  if (
    !key.classList.contains("delete") &&
    !key.classList.contains("equal") &&
    !key.classList.contains("reset")
  ) {
    key.addEventListener("click", keyPressHandler);
  } else if (key.classList.contains("equal")) {
    key.addEventListener("click", calculate);
  } else if (key.classList.contains("delete")) {
    key.addEventListener("click", backspace);
  } else if (key.classList.contains("reset")) {
    key.addEventListener("click", reset);
  }
});

//END OF CALCULATOR LOGIC