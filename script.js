const billInput = document.getElementById("bill"); 
const peopleInput = document.getElementById("num-people");
const customTip = document.getElementById("custom-amount");

const resetButton = document.getElementById("reset");
const warning = document.querySelector(".warning");

const totalDisplay = document.getElementById("total-calculated");
const tipDisplay = document.getElementById("tip-calculated");

let billAmount = null;
let numPeople = null;
let tipPercent = null;

billInput.addEventListener("input", () => { 
    resetButton.classList.add("active");

    const calculate = getValidationStatus(); 
    if (calculate) {
        displayCalculation();
    }
});

peopleInput.addEventListener("input", () => {
    resetButton.classList.add("active");

    const calculate = getValidationStatus();
    if (calculate) {
        displayCalculation();
    }
});

customTip.addEventListener("input", () => {
    resetButton.classList.add("active");

    const calculate = getValidationStatus();
    if (calculate) {
        displayCalculation();
    }
});

const tipButtons = document.querySelectorAll(".tip-button");
const tipButtonParentDiv = document.querySelector(".button-wrapper");

tipButtonParentDiv.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        customTip.value = ""; //clear out any custom input 
        removeClassName("valid", customTip); //and any prev error styling
        removeClassName("invalid", customTip);

        resetButton.classList.add("active"); 
        deselectButtons(); //in case any button was selected previously
        event.target.classList.add("selected");
        tipPercent = parseFloat(event.target.innerText); 

        //call getValidationStatus
        const calculate = getValidationStatus();
        if (calculate) {
            displayCalculation();
        }
    }
});

resetButton.addEventListener("click", () => {
    billInput.value = "";
    peopleInput.value = "";
    customTip.value = "";
    resetButton.classList.remove("active");
    deselectButtons();

    billAmount = numPeople = tipPercent = null; 
    totalDisplay.innerText = tipDisplay.innerText = "$0.00";
    warning.classList.remove("on");

    removeClassName("valid", billInput, peopleInput, customTip);
    removeClassName("invalid", billInput, peopleInput, customTip);
});

function deselectButtons() {
    for (let i = 0; i < tipButtons.length; i++){
        tipButtons[i].classList.remove("selected");
    }
}

function validateInput(parsedInputValue, people=false) {
    if (isNaN(parsedInputValue)){
        return false;
    }
    if (people && parsedInputValue === 0) {
        return false;
    }
    return true;
}

function getValidationStatus() {
    if (billInput.value !== "" && !validateInput(parseFloat(billInput.value))) {
        addClassName("invalid", billInput);
        removeClassName("valid", billInput);
        billAmount = null;
    }
    else if (billInput.value !== "" && validateInput(parseFloat(billInput.value))) {
        addClassName("valid", billInput);
        removeClassName("invalid", billInput);
        billAmount = billInput.value;
    }

    if (peopleInput.value !== "" && !validateInput(parseFloat(peopleInput.value), true)) {
        addClassName("invalid", peopleInput);
        removeClassName("valid", peopleInput);
        numPeople = null;
        if (peopleInput.value === "0") {
            warning.classList.add("on");
        }
        else {
            warning.classList.remove("on");
        }
    }
    else if (peopleInput.value !== "" && validateInput(parseFloat(peopleInput.value), true)) {
        addClassName("valid", peopleInput);
        removeClassName("invalid", peopleInput);
        numPeople = peopleInput.value;
        warning.classList.remove("on");
    }

    if (customTip.value !== "" && !validateInput(parseFloat(customTip.value))) {
        addClassName("invalid", customTip);
        removeClassName("valid", customTip);
        tipPercent = null;
    }
    else if (customTip.value !== "" && validateInput(parseFloat(customTip.value))){
        addClassName("valid", customTip);
        removeClassName("invalid", customTip);
        tipPercent = customTip.value;
    }
    return readyToCalculate(); 
}

function addClassName(classToAdd, ...args) {
    for (let i = 0; i < args.length; i++) {
        args[i].classList.add(classToAdd);
    }
}
function removeClassName(classToRemove, ...args) { 
    for (let i = 0; i < args.length; i++) {
        args[i].classList.remove(classToRemove);
    }
}

function readyToCalculate() {
    return billAmount && numPeople && tipPercent;
}

function calculate() {
    const tipOwed = (billAmount / numPeople) * (tipPercent / 100); 
    const totalOwed = (billAmount / numPeople) + tipOwed; 
    return [Math.ceil(tipOwed * 100) / 100, Math.ceil(totalOwed * 100) / 100] //rounded up to nearest cent
}

function displayCalculation() {
    //removes "valid" from inputs, won't have invalid if we got here
    removeClassName("valid", billInput, peopleInput, customTip);
    //calculate
    let [tipOwed, totalOwed] = calculate();
    //display
    totalDisplay.innerText = `$${totalOwed.toFixed(2)}`;
    tipDisplay.innerText = `$${tipOwed.toFixed(2)}`;
}