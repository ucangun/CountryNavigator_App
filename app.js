const otherButton = document.querySelector(".other");
const whereButton = document.querySelector(".where");
const displayRow = document.querySelector(".display");
const displayFlag = document.querySelector(".displayFlag");
const displayAdress = document.querySelector(".displayAdress");

// ! Geolocation Function
let lat;
let long;

navigator.geolocation.getCurrentPosition((pos) => {
  const { latitude: lat, longitude: long } = pos.coords;

  getLocation(lat, long);
});

// ! Geocoding API

let countryName;
let country;

const getLocation = async (lat, long) => {
  const res = await fetch(`https://geocode.xyz/${lat},${long}?geoit=json`);

  const data = await res.json();
  //console.log(`You are currently in ${data.city} , ${data.country} `);
  country = data;
  countryName = data.country;
};

const printAddress = (country) => {
  const html = `
  <p>You are currently in ${country.city} , ${country.country}</p>`;

  displayAdress.insertAdjacentHTML("beforeend", html);
};

// ! Country API

const getCountry = async (countryName) => {
  const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
  const data = await res.json();
  //console.log(data);
  data.forEach((data) => printScreen(data));
};

const printScreen = (data) => {
  const html = `
<div class="card col-8 col-md-5 col-lg-3 p-0" style="width: 18rem;">
  <img src="${data.flags.svg}" class="card-img-top card-img"   />
  <div class="card-body d-flex flex-column justify-content-between">
    <h5 class="card-title">${data.name.common}</h5>
    <ul class="card-list list-unstyled me-2 fs-2">
      <li>🏛️ ${data.capital}</li>
      <li>💰 ${Object.values(data.currencies)[0].name}</li>
      <li>👬 ${(Number(data.population) / 1000000).toFixed(2)} </li>
    </ul>
    <a href="#" class="btn btn-primary btn-lg">Get Neighbours!</a>
  </div>
  </div> 
  `;

  displayFlag.insertAdjacentHTML("beforeend", html);
};

//! Event Listeners

whereButton.addEventListener("click", () => {
  getLocation(lat, long);
  printAddress(country);
  getCountry(countryName);
});
