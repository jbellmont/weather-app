const key = '923f5260b0e11473881aa435fbcf82dd'; // API key
const searchBar = document.getElementById('search-bar'); // Search bar component
const submitButton = document.getElementById('submit-btn'); // Submit button component
const headerContainer = document.getElementById('header-contents'); // H1 + Search Bar container
const tileContainer = document.querySelector('.tile-container'); // Tile container
let tilesUl = document.querySelector('.tile-cities'); // List of tiles
let countOfListItems = tilesUl.getElementsByTagName("li"); // Count of number of tiles, used to enforce of a maximum of 4
let errorMessage = document.getElementById("error-message");
let removeButtons = document.getElementsByClassName('remove-tile');
let currentCities = [];

function searchCityAddTile() {
  // Makes a GET request to Openweather's API
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchBar.value}&appid=${key}&units=metric`;
  
  // Checks if there are 4 tiles visible
  
  if (countOfListItems.length === 4) {
    errorMessage.style.color = "#FFFFFF";
    errorMessage.innerText = "Too many cities added. Maximum of four";

  } else {
      fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (currentCities.includes(`${data.name} ${data.sys.country}`)) {
          errorMessage.style.color = "#FFFFFF";
          return errorMessage.innerText = "City already added. Please choose another city";
        } else {
          console.log('fucked');
        }

        // Shrink the Header
        headerContainer.style.height = '50vh';
        tileContainer.style.display = 'block';

        // Create a tile li element
        let cityTileLi = document.createElement("LI");
        cityTileLi.classList.add('tile-item');
        tilesUl.appendChild(cityTileLi); // append to ul
        cityTileLi.innerHTML = `
          <h1 class="city-name">${data.name} <sup class="sup">${data.sys.country}</sup></h1>

          <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">

          <h2 class="city-temp">${Math.round(data.main.temp)}°C</h2>

          <span class="remove-tile">x</span>
          `;
        
        // Add city to currentCities, as a record of what's active. This will help with checking if a city has already been added
        currentCities.push(`${data.name} ${data.sys.country}`);
        })
      .catch(() => {
        errorMessage.innerText = "Invalid city name";
        setTimeout(function() {
          errorMessage.innerText = "";
        }, 2000)
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
    currentTile.parentNode.removeChild(currentTile);

    if (countOfListItems.length === 0) {
      headerContainer.style.height = '100vh';
    }
	}
}, false);