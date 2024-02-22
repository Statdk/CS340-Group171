document.addEventListener('DOMContentLoaded', (event) => {
  fetch('header.html')
    .then(response => response.text())
    .then(htmlString => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const headerElement = doc.querySelector('.navigation');
      document.getElementById('header-placeholder').appendChild(headerElement);
    })
    .catch(error => {
      console.error('Error loading the header:', error);
    });
});