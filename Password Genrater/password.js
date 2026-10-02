document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const passwordInput = document.getElementById('passwordInput');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const copyIcon = document.getElementById('copyIcon');
  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  // Password Length & Character Sets
  const passwordLength = 12;
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allCharacters = upperCase + lowerCase + numbers + symbols;

  // Function to Generate a Random Strong Password
  const generatePassword = () => {
    let password = '';

    // Ensure at least one character from each character set
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill remaining characters randomly
    while (password.length < passwordLength) {
      password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    // Shuffle the generated password characters randomly
    const shuffledPassword = password.split('').sort(() => 0.5 - Math.random()).join('');

    // Update Input
    passwordInput.value = shuffledPassword;

    // Reset Copy Icon if it was changed
    copyIcon.className = 'fa-regular fa-copy';
    copyIcon.style.color = '#019a51';
  };

  // Show Toast Message Function
  const showToast = (message) => {
    toastText.textContent = message;
    toastMessage.style.display = 'block';
    setTimeout(() => {
      toastMessage.style.display = 'none';
    }, 2000);
  };

  // Function to Copy Password to Clipboard
  const copyPassword = async () => {
    const password = passwordInput.value;

    // If no password is generated yet, warn the user
    if (!password) {
      showToast('Please generate a password first!');
      return;
    }

    try {
      // Modern Clipboard API
      await navigator.clipboard.writeText(password);

      // Change Icon temporarily to Checkmark
      copyIcon.className = 'fa-solid fa-check';
      copyIcon.style.color = '#019a51';

      showToast('Password Copied!');

      setTimeout(() => {
        copyIcon.className = 'fa-regular fa-copy';
      }, 2000);

    } catch (err) {
      // Fallback for older browsers
      passwordInput.select();
      document.execCommand('copy');
      
      copyIcon.className = 'fa-solid fa-check';
      showToast('Password Copied!');

      setTimeout(() => {
        copyIcon.className = 'fa-regular fa-copy';
      }, 2000);
    }
  };

  // Event Listeners
  generateBtn.addEventListener('click', generatePassword);
  copyBtn.addEventListener('click', copyPassword);

  // NOTE: Initial load par koi password generate nahi hoga.
  // Input placeholder "Password" show karega jab tak button click na ho.
});