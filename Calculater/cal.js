const display = document.getElementById('display');

// Values ko display par show karne ka function
const appendValue = (value) => {
  display.value += value;
};

// Pure screen ko clear (AC) karne ka function
const clearDisplay = () => {
  display.value = '';
};

// Single last character delete karne ka function
const deleteLast = () => {
  display.value = display.value.slice(0, -1);
};

// Final calculation handler
const calculate = () => {
  if (display.value === '') return;

  try {
    // Percentage handling (% ko /100 se replace karna)
    let expression = display.value.replace(/%/g, '/100');
    display.value = eval(expression);
  } catch (error) {
    display.value = 'Error';
    setTimeout(() => {
      clearDisplay();
    }, 1200);
  }
};

// Keyboard input support
document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (!isNaN(key) || ['+', '-', '*', '/', '.', '%'].includes(key)) {
    appendValue(key);
  } else if (key === 'Enter') {
    event.preventDefault();
    calculate();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key === 'Escape') {
    clearDisplay();
  }
});