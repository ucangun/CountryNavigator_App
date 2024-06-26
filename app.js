const otherButton = document.querySelector(".other");
const whereButton = document.querySelector(".where");
const displayRow = document.querySelector(".display");
const displayFlag = document.querySelector(".displayFlag");
const displayAdress = document.querySelector(".displayAdress");
const buttonContainer = document.querySelector(".buttonContainer");
const displayContainer = document.querySelector(".displayContainer");
const inputContainer = document.querySelector(".inputContainer");

// ! Geolocation Function
let lat, long;

navigator.geolocation.getCurrentPosition((pos) => {
  lat = pos.coords.latitude;
  long = pos.coords.longitude;
});

// ! Geocoding API

let countryName;
let country;

const getLocation = async (lat, long) => {
  try {
    const res = await fetch(`https://geocode.xyz/${lat},${long}?geoit=json`);
    if (!res.ok) {
      throw new Error(`The country could not be found 😔 ${res.status}`);
    }
    const data = await res.json();
    country = data;
    countryName = data.country;
    printAddress(country);
  } catch (error) {
    displayFlag.textContent = `${error}`;
  }
};

const printAddress = (country) => {
  const html = `
  <p class="adressText">You are currently in ${country.city} , ${country.country}</p>`;

  displayAdress.innerHTML = html;
};

// ! Country API

const getCountry = async (countryName) => {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    if (!res.ok) {
      throw new Error(`Country data could not be retrieved 😔 ${res.status}`);
    }
    const data = await res.json();
    seeLocation(data);
    data.forEach((data) => printLocationCard(data));
  } catch (error) {
    console.error(`Error fetching country data: ${error}`);
    displayFlag.textContent = `${error}`;
  }
};

const printLocationCard = (data) => {
  const html = `
  <div class="card p-0" style="width: 25rem;">
    <img src="${data.flags.svg}" class="card-img-top card-img" />
    <div class="card-body d-flex flex-column justify-content-between">
      <h5 class="card-title">${data.name.common}</h5>
      <ul class="card-list list-unstyled me-2 fs-2">
        <li><i class="fa-solid fa-landmark"></i> ${data.capital}</li>
        <li><i class="fa-solid fa-coins"></i> ${
          Object.values(data.currencies)[0].name
        }</li>
        <li><i class="fa-solid fa-person"></i> ${(
          Number(data.population) / 1000000
        ).toFixed(2)}</li>
      </ul>
      <a href="#" class="btn btn-primary btn-lg location">Location!</a>
    </div>
  </div>`;
  displayFlag.innerHTML = html;
};

//! Other Buttons

const getOtherCountry = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const data = await res.json();

  seeLocation(data);
  input(data);
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

const input = (data) => {
  document.querySelector("input").oninput = (e) => {
    const filteredData = data.filter((country) =>
      country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
    );

    displayRow.innerHTML = "";
    filteredData.forEach((country) => printCountryCard(country));
  };
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

//! Event Listeners

whereButton.addEventListener("click", () => {
  getLocation(lat, long);
  getCountry(countryName);
});

otherButton.addEventListener("click", () => {
  getOtherCountry();
});
