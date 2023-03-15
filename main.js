/* Weather App */

/* Set base URL and API key for requests */
const api = {
    key: '6882cd2a094b41eef4bfbd4bf6b36f7e',
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

/* Add event listeners fot the searchbox and search button */
const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', () => getResults(`q=${searchbox.value}`));


function setQuery(evt) {
    if (evt.keyCode == 13) {
        getResults(`q=${searchbox.value}`); 
    }    
}

/* Fetch Chicago data for the initial weather values */
window.addEventListener('load', () => getResults('q=Chicago'));


/* Make API request and handle errors */
function getResults (query) {
    
    fetch(`${api.baseurl}weather?${query}&units=imperial&appid=${api.key}`)
    .then(weather => {
        if (weather.status == 200) {
            return weather.json();
        }
        else {
            throw new Error(weather.status);
        }
        
    }).then(displayResults)
    .catch(() => {
        searchbox.value = '';
        window.alert('City not found. Please try a different city')
    }); 
    
}

/* Populate weather data on the page */
let city = document.querySelector('.location .city');
let now = new Date();
let date = document.querySelector('.location .date');
let temp = document.querySelector('.current .temp');
let weather_el = document.querySelector('.current .weather');
let hilow = document.querySelector('.hi-low');
let hilowCelsius = document.querySelector('.hi-low-celsius');
let humidity = document.querySelector('.humidity');
let feels = document.querySelector('.feels-like');
let celsius = document.querySelector('.celsius');

function displayResults (weather) {
    
    if (weather) {
        
        searchbox.value='';

        city.innerText = `${weather.name}, ${weather.sys.country}`;
        
        date.innerText = dateBuilder(now);
               
        temp.innerHTML = `${Math.round(weather.main.temp)}<span>°F</span>`
       
        weather_el.innerText = weather.weather[0].main;

        hilow.innerText = `${Math.round(weather.main.temp_min)}°F / ${Math.round(weather.main.temp_max)}°F`;

        hilowCelsius.innerText = `${Math.round((weather.main.temp_min - 32) * 0.5556)}°C / ${Math.round((weather.main.temp_max - 32) * 0.5556)}°C`;
        
        humidity.innerText = `Humidity ${weather.main.humidity}%`;
        
        feels.innerText = `Feels Like ${Math.round(weather.main.feels_like)}°F`;
        
        celsius.innerText = `${Math.round((weather.main.temp - 32) * 0.5556)}°C`;
    }
}

/* Date helper function */
function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    
    let day = days[d.getDay()]; 
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
}  

/* Handle errors from location functionality */
function errorHandler() {

    const link = document.createElement("a");
    link.href = "";
    link.classList.add('location-link');
    link.innerHTML = 'try again';
    document.querySelector('.location-option').innerHTML = `unable to determine your location`;
    document.querySelector('header').appendChild(link);
    link.addEventListener('click', () => {window.location = window.location});
}

/* Determine device's location */
function useLocation(evt) {
    
    evt.preventDefault();
    const success = (position) => {
        getResults(`lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
    };
      
    const error = () => {
        errorHandler()
    };    
    navigator.geolocation.getCurrentPosition(success, error, {timeout:5000});

}

/* Add event listener for the 'use location' link */
const locationLink = document.querySelector('.location-link').addEventListener('click', useLocation);
 