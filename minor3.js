const display = document.querySelector('.user-input');
const buttons = document.querySelectorAll('.key');
const deleteButton = document.querySelector('.delete-key');
const resetButton = document.querySelector('.reset-key');
const equalButton = document.querySelector('.equal-key');

let currentInput = '';
let lastClickedWasOperator = false;
let operators = ['+', '-', '/', 'x'];
let hasDecimal = false;

//update display
function updateDisplay(value) {
    display.value = value;
    display.scrollLeft = display.scrollWidth; 
}

//function to validate current input
function isValidExpression(expression) {
    const validPattern = /^-?(\d+(\.\d+)?)([-+/*]\d+(\.\d+)?)*$/;
    return validPattern.test(expression);
}

//handle no and operator button click
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (!isNaN(value)) { // Numbers
            currentInput += value;
            lastClickedWasOperator = false;
        } else if (value === '.') { //decimal point
            if (!hasDecimal) { 
                currentInput += value;
                hasDecimal = true; 
            }
        } else if (operators.includes(value)) {
            if (currentInput === '' && value !== '-') {
                return;
            }
            if (lastClickedWasOperator) {
                return;//prevent consecutive operators
            }
            currentInput += value === 'x' ? '*' : value;
            lastClickedWasOperator = true;
            hasDecimal = false; 
        }

        updateDisplay(currentInput);
    });
});

//delete button
deleteButton.addEventListener('click', () => {
    const lastChar = currentInput.slice(-1);
    currentInput = currentInput.slice(0, -1);

    if (lastChar === '.') {
        hasDecimal = false; 
    }
    updateDisplay(currentInput || '0');
    lastClickedWasOperator = false;
});

//reset button
resetButton.addEventListener('click', () => {
    currentInput = '';
    updateDisplay('0');
    lastClickedWasOperator = false;
    hasDecimal = false;
});

//equal button
equalButton.addEventListener('click', () => {
    if (lastClickedWasOperator) {
        updateDisplay('Error');
        return; 
    }

    if (isValidExpression(currentInput)) {
        let result = eval(currentInput); //evaluate the expression
        result = parseFloat(result.toFixed(3)); //limit to 3 decimal places
        currentInput = result.toString();
        updateDisplay(currentInput);
    } else {
        updateDisplay('Error'); //shows error if expression is invalid
    }

    lastClickedWasOperator = false;
    hasDecimal = false; 
});
