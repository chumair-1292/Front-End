// Adds mobile touch support (tap to trigger card expansion)
const card = document.querySelector('.card');

card.addEventListener('click', () => {
  if (window.innerWidth <= 650) {
    card.classList.toggle('active');
  }
});