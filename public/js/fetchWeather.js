
const locationEl = document.querySelector('#location');
const forecastEl = document.querySelector('#forecast');
const temperatureEl = document.querySelector('#temperature');

document.querySelector('#search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    locationEl.textContent = 'Loading...';
    forecastEl.textContent = '';
    temperatureEl.textContent = '';
    fetchDataFromEndpoint(e.target.elements.searchInput.value);
});

const fetchDataFromEndpoint = (adresse) => {
    fetch(`/weather?address=${adresse}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.error) {
                locationEl.textContent = `Uups... ${data.error}`;

            } else {
                locationEl.textContent = `Location: ${data.location}`;
                forecastEl.textContent = `Vorschau: ${data.forecast}`;
                temperatureEl.textContent = `Jetzt: ${data.temperatur}°C, gefühlt: ${data.apperentTemp}°C`;
            }
        });
};