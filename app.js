const otherButton = document.querySelector(".other");
const whereButton = document.querySelector(".where");

// ! Geolocation Function
let lat;
let long;

navigator.geolocation.getCurrentPosition((pos) => {
  const { latitude: lat, longitude: long } = pos.coords;

  getLocation(lat, long);
});

// ! Geocoding API

const getLocation = async (lat, long) => {
  const res = await fetch(`https://geocode.xyz/${lat},${long}?geoit=json`);

  const data = await res.json();
  //console.log(data);
  console.log(`You are currently in ${data.city} , ${data.country} `);
};

whereButton.addEventListener("click", () => {
  getLocation(lat, long);
});
