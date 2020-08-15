const key = '923f5260b0e11473881aa435fbcf82dd';
const searchBar = document.getElementById('search-bar');
const submitButton = document.getElementById('submit-btn');
const headerContainer = document.getElementById('header-contents');
const tileContainer = document.querySelector('.tile-container');
let tilesUl = document.querySelector('.tile-cities');

function searchCityAddTile() {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchBar.value}&appid=${key}&units=metric`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // Shrink the Header
      headerContainer.style.height = '50vh';
      tileContainer.style.display = 'block';

      // Create a tile li element
      let cityTileLi = document.createElement("LI");
      cityTileLi.classList.add('tile-item');
      tilesUl.appendChild(cityTileLi); // append to ul
      cityTileLi.innerHTML = `
        <h1 class="city-name">${data.name}</h1>

        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">

        <h2 class="city-temp">${Math.round(data.main.temp)}°C</h2>
        `;
    })
    .catch(() => console.log("error!"))
}

submitButton.addEventListener('click', searchCityAddTile);