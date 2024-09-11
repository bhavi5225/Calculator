const display = document.querySelector('.user-input');
const buttons = document.querySelectorAll('.key');
const deleteButton = document.querySelector('.delete-key');
const resetButton = document.querySelector('.reset-key');
const equalButton = document.querySelector('.equal-key');

let currentInput = '';
let lastClickedWasOperator = false;
let operators = ['+', '-', '/', 'x'];
let hasDecimal = false; // Track if the current number segment already has a decimal point

// Helper function to update display
function updateDisplay(value) {
    display.value = value;
    display.scrollLeft = display.scrollWidth; // Auto scroll to the right when input exceeds width
}

// Function to validate the current input before evaluation
function isValidExpression(expression) {
    const validPattern = /^-?(\d+(\.\d+)?)([-+/*]\d+(\.\d+)?)*$/;
    return validPattern.test(expression);
}

// Handle number and operator button clicks
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (!isNaN(value)) { // Numbers
            currentInput += value;
            lastClickedWasOperator = false;
        } else if (value === '.') { // Decimal point
            if (!hasDecimal) { // Only allow decimal if one doesn't already exist in the current number
                currentInput += value;
                hasDecimal = true; // Set flag indicating current number has a decimal
            }
        } else if (operators.includes(value)) { // Operators
            if (currentInput === '' && value !== '-') {
                return; // Ignore if first input is not a minus sign
            }
            if (lastClickedWasOperator) {
                return; // Prevent consecutive operators
            }
            currentInput += value === 'x' ? '*' : value; // Convert 'x' to '*'
            lastClickedWasOperator = true;
            hasDecimal = false; // Reset decimal flag for the next number
        }

        updateDisplay(currentInput);
    });
});

// Handle Delete button
deleteButton.addEventListener('click', () => {
    const lastChar = currentInput.slice(-1);
    currentInput = currentInput.slice(0, -1);

    if (lastChar === '.') {
        hasDecimal = false; // Reset flag if decimal was deleted
    }
    updateDisplay(currentInput || '0');
    lastClickedWasOperator = false;
});

// Handle Reset button
resetButton.addEventListener('click', () => {
    currentInput = '';
    updateDisplay('0');
    lastClickedWasOperator = false;
    hasDecimal = false;
});

// Handle Equal button
equalButton.addEventListener('click', () => {
    if (lastClickedWasOperator) {
        updateDisplay('Error');
        return; // Prevent calculation if the last input was an operator
    }

    if (isValidExpression(currentInput)) {
        // Evaluate the expression since it's valid
        let result = eval(currentInput); // Evaluate the expression
        result = parseFloat(result.toFixed(3)); // Limit to 3 decimal places
        currentInput = result.toString();
        updateDisplay(currentInput);
    } else {
        updateDisplay('Error'); // Show error if expression is invalid
    }

    lastClickedWasOperator = false;
    hasDecimal = false; // Reset decimal tracking after calculation
});
