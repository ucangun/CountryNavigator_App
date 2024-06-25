// ! Geolocation Function

navigator.geolocation.getCurrentPosition((pos) => {
  const { latitude: lat, longitude: long } = pos.coords;
  console.log(lat, long);
});
