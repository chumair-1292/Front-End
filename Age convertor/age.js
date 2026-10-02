document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const dateInput = document.getElementById('dateInput');
  const calculateBtn = document.getElementById('calculateBtn');
  const resultText = document.getElementById('resultText');

  // Set maximum date limit to Today (Future dates selection disabled)
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const maxDate = `${yyyy}-${mm}-${dd}`;
  dateInput.setAttribute('max', maxDate);

  // Helper function to get exact total days in a given month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // Main Calculation Logic
  const calculateAge = () => {
    const userInput = dateInput.value;

    if (!userInput) {
      resultText.innerHTML = 'Please select your birth date!';
      return;
    }

    const birthDate = new Date(userInput);

    const birthDay = birthDate.getDate();
    const birthMonth = birthDate.getMonth() + 1; // Months are 0-indexed in JS
    const birthYear = birthDate.getFullYear();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    let years = currentYear - birthYear;
    let months = currentMonth - birthMonth;
    let days = currentDay - birthDay;

    // Adjust days if current day is less than birth day
    if (days < 0) {
      months--;
      // Borrow days from previous month
      const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
      days += daysInPrevMonth;
    }

    // Adjust months if current month is less than birth month
    if (months < 0) {
      years--;
      months += 12;
    }

    // Display Result formatted with Yellow Highlighted Numbers
    resultText.innerHTML = `You are <span class="yellow-num">${years}</span> years, <span class="yellow-num">${months}</span> months and <span class="yellow-num">${days}</span> days old`;
  };

  // Click Event Listener
  calculateBtn.addEventListener('click', calculateAge);

  // Trigger calculation on Enter key press inside input
  dateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      calculateAge();
    }
  });
});