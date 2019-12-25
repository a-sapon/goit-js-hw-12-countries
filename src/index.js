import './styles.css';
import fetchCountries from './fetchCountries';
import templateOneCountry from './templates/country.hbs';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';
import "../node_modules/pnotify/dist/PNotifyBrightTheme.css";

const refs = {
  searchForm: document.getElementById('search-form'),
  output: document.querySelector('.output'),
  listOutput: document.querySelector('.list-output'),
};

refs.searchForm.addEventListener('input', inputHandler);
let timerId;

function inputHandler(e) {
  clearOutput();
  PNotify.closeAll();
  clearTimeout(timerId);
  const searchValue = e.currentTarget.elements.search.value;
  timerId = setTimeout(() => {
    if (searchValue === '') {
      clearOutput();
      return;
    }
    fetchCountries(searchValue)
      .then(data => {
       if (data && data.status === 404){
        PNotify.notice('There\s no such country :( Please check your spelling!');
       };
        if (data.length > 10) {
          PNotify.error({
            text: 'Too many matches found. Please enter a more specisic query!',
          });
          clearOutput();
        } else if (data.length > 1 && data.length < 10) {
          data.map(country => {
            refs.listOutput.insertAdjacentHTML(
              'beforeend',
              `<li>${country.name}</li>`,
            );
          });
          refs.output.innerHTML = '';
          PNotify.closeAll();
        } else if (data.length === 1) {
          const completedTemplate = templateOneCountry(data);
          refs.output.insertAdjacentHTML('beforeend', completedTemplate);
          refs.listOutput.innerHTML = '';
          PNotify.closeAll();
        }
      })
      .catch(error => console.log('My error: ', error));
  }, 500);
}

function clearOutput() {
  refs.listOutput.innerHTML = '';
  refs.output.innerHTML = '';
}