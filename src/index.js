import './index.css';

const ham = document.querySelector('.ham');
const menu = document.querySelector('.sidebarMenu');

ham.addEventListener('click', () => {
  menu.classList.toggle('active');
});
