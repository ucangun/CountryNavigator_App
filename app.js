const otherButton = document.querySelector(".other");
const whereButton = document.querySelector(".where");
const displayRow = document.querySelector(".display");
const displayFlag = document.querySelector(".displayFlag");
const displayAdress = document.querySelector(".displayAdress");
const buttonContainer = document.querySelector(".buttonContainer");
const displayContainer = document.querySelector(".displayContainer");
const inputContainer = document.querySelector(".inputContainer");

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
  <p class="adressText">You are currently in ${country.city} , ${country.country}</p>`;

  displayAdress.insertAdjacentHTML("beforeend", html);
};

// ! Country API

const getCountry = async (countryName) => {
  const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
  const data = await res.json();
  seeLocation(data);
  //console.log(data);
  data.forEach((data) => printLocationCard(data));
};

const printLocationCard = (data) => {
  const html = `
<div class="card  p-0" style="width: 25rem;">
  <img src="${data.flags.svg}" class="card-img-top card-img"   />
  <div class="card-body d-flex flex-column justify-content-between">
    <h5 class="card-title">${data.name.common}</h5>
    <ul class="card-list list-unstyled me-2 fs-2">
      <li><i class="fa-solid fa-landmark"></i> ${data.capital}</li>
      <li><i class="fa-solid fa-coins"></i> ${
        Object.values(data.currencies)[0].name
      }</li>
      <li><i class="fa-solid fa-person"></i> ${(
        Number(data.population) / 1000000
      ).toFixed(2)} </li>
    </ul>
    <a href="#" class="btn btn-primary btn-lg location">Location!</a>
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

otherButton.addEventListener("click", () => {
  getOtherCountry();
});

//! Other Buttons

const getOtherCountry = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const data = await res.json();
  console.log(data);

  input(data);
  seeLocation(data);

  displayRow.innerHTML = "";
  displayContainer.classList.add("d-none");
  inputContainer.classList.remove("d-none");

  data.forEach((country) => {
    printCountryCard(country);
  });
};

const printCountryCard = (data) => {
  const html = `
<div class="card col-12 col-md-4 p-0" style="width: 25rem;">
  <img src="${data.flags.svg}" class="card-img-top card-img" />
  <div class="card-body d-flex flex-column justify-content-between">
    <h5 class="card-title">${data.name.common}</h5>
    <ul class="card-list list-unstyled me-2">
      <li><i class="fa-solid fa-landmark"></i> ${data.capital}</li>
      <li><i class="fa-solid fa-coins"></i> ${
        Object.values(data.currencies)[0].name
      }</li>
      <li><i class="fa-solid fa-person"></i>${(
        Number(data.population) / 1000000
      ).toFixed(2)} </li>
    </ul>
    <a href="#" class="btn btn-primary btn-lg location">Location!</a>
  </div>
  </div> 
  `;

  displayRow.insertAdjacentHTML("beforeend", html);
};

const seeLocation = (data) => {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("location")) {
      const countryName = e.target
        .closest(".card")
        .querySelector(".card-title").textContent;
      const countryData = data.find(
        (country) => country.name.common === countryName
      );

      if (countryData && countryData.maps && countryData.maps.googleMaps) {
        const googleMapsUrl = countryData.maps.googleMaps;
        window.open(googleMapsUrl, "_blank");
      }
    }
  });
};

const input = (data) => {
  document.querySelector("input").oninput = (e) => {
    const filteredData = data.filter((country) =>
      country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
    );

    displayRow.innerHTML = "";
    filteredData.forEach((country) => printCountryCard(country));
  };
};
