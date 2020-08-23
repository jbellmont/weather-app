const key = '923f5260b0e11473881aa435fbcf82dd'; // API key
const searchBar = document.getElementById('search-bar'); // Search bar component
const submitButton = document.getElementById('submit-btn'); // Submit button component
const headerContainer = document.getElementById('header-contents'); // H1 + Search Bar container
const tileContainer = document.querySelector('.tile-container'); // Tile container
const appTitle = document.querySelector('#app-title');
let tilesUl = document.querySelector('.tile-cities'); // List of tiles
let countOfListItems = tilesUl.getElementsByTagName("li"); // Count of number of tiles, used to enforce of a maximum of 4
let helpInfo = document.getElementById("help-info");
let helpInfoDelay;
let removeButtons = document.getElementsByClassName('remove-tile');
let currentCities = [];


// Fade in helper info message, then fade out after 3 seconds
function fadeInOutHelpInfo(message) {
  clearInterval(helpInfoDelay);
  helpInfo.style.opacity = 1;
  helpInfo.innerText = String(message);
  helpInfoDelay = setTimeout(() => helpInfo.style.opacity = 0, 3000);
}


// Click on Weather App title to reset
appTitle.addEventListener('click', () => {

  // clear City array
  const cityArrayLength = currentCities.length
  for (let i = 0; i < cityArrayLength; i++) {
    currentCities.pop();
  }

  // Delete all li items
  document.querySelectorAll('li').forEach(tile => {
    tile.parentNode.removeChild(tile);
  })

  tileContainer.style.display = 'none';
  tileContainer.style.height = '0vh';
  headerContainer.style.height = '100vh';
  setTimeout(() => {
    helpInfo.style.opacity = 1;
    helpInfo.innerText = "Add up to four cities to compare their weather";
  }, 250);
})


function searchCityAddTile(e) {
  // Stop submitting and refreshing on 'Enter' keypress
  e.preventDefault();

  // Fade out Helper Text
  helpInfo.style.opacity = 0;

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchBar.value}&appid=${key}&units=metric`;

  // Reset the search bar value
  searchBar.value = '';

  // Checks if there are 4 tiles visible
  if (countOfListItems.length === 4) {
    fadeInOutHelpInfo("Too many cities added. Maximum of four");
  } else {
      // Makes a GET request using Openweather's API
      fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (currentCities.includes(`${data.name} ${data.sys.country}`)) {
          return fadeInOutHelpInfo("City already added. Please choose another city");
        }

        // Shrink the Header
        headerContainer.style.height = '50vh';
        tileContainer.style.display = 'block';

        // Create a the city tile li element
        let cityTileLi = document.createElement("LI");
        cityTileLi.classList.add('tile-item');
        tilesUl.appendChild(cityTileLi); // append to ul
        cityTileLi.innerHTML = 
          `
          <h1 class="city-name">${data.name} <sup class="sup">${data.sys.country}</sup></h1>

          <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">

          <h2 class="city-temp">${Math.round(data.main.temp)}°C</h2>

          <span class="remove-tile">&#10006;</span>
          `;

        // Add city to currentCities, as a record of what's active. This will help with checking if a city has already been added
        currentCities.push(`${data.name} ${data.sys.country}`);
        })
      .catch(() => {
        fadeInOutHelpInfo("Invalid city name");
      })
  }
}


// Search city, and adds new tile based on the GET request
submitButton.addEventListener('click', searchCityAddTile);


// Remove button. Deletes the target tile from the HTML list of tiles
document.addEventListener('click', function(event) {
	if (event.target.matches('.remove-tile')) {
    let currentTile = event.target.parentNode;
    let currentTileCityName = currentTile.querySelector('h1').innerText;
    currentCities.splice(currentCities.indexOf(currentTileCityName), 1);
    currentTile.style.opacity = 0;
    currentTile.addEventListener('transitionend', function() {
      // After clicking on close button, tile will fade out. After fade out, delete the tile and run the check
      currentTile.parentNode.removeChild(currentTile);
      if (countOfListItems.length === 0) {
        tileContainer.style.display = 'none';
        tileContainer.style.height = '0vh';
        headerContainer.style.height = '100vh';
        setTimeout(() => {
          helpInfo.style.opacity = 1;
          helpInfo.innerText = "Add up to four cities to compare their weather";
        }, 250);
      }
    })
	}
}, false);