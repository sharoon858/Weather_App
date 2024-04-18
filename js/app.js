const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "4d8fb5b93d4af21d66a2948710284366";

form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();
  const inputVal = input.value;

  if (isCityAlreadyListed(inputVal)) {
    return;
  }

  fetchWeatherData(inputVal);
}

function isCityAlreadyListed(inputVal) {
  const listItems = list.querySelectorAll(".city");
  for (const listItem of listItems) {
    const cityName = listItem.querySelector(".city-name span").textContent.toLowerCase();
    const country = listItem.querySelector(".city-name sup").textContent;
    if (`${cityName},${country}` === inputVal.toLowerCase()) {
      showAlreadyKnownMessage(cityName);
      return true;
    }
  }
  return false;
}

function showAlreadyKnownMessage(cityName) {
  msg.textContent = `You already know the weather for ${cityName} ...otherwise be more specific by providing the country code as well 😉`;
  form.reset();
  input.focus();
}

function fetchWeatherData(inputVal) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

      const li = createCityListItem(name, sys.country, main.temp, weather[0]["icon"], weather[0]["description"]);
      list.appendChild(li);
    })
    .catch(() => {
      showInvalidCityMessage();
    });

  msg.textContent = "";
  form.reset();
  input.focus();
}

function createCityListItem(cityName, country, temperature, iconCode, description) {
  const li = document.createElement("li");
  li.classList.add("city");
  const markup = `
    <h2 class="city-name" data-name="${cityName},${country}">
      <span>${cityName}</span>
      <sup>${country}</sup>
    </h2>
    <div class="city-temp">${Math.round(temperature)}<sup>°C</sup></div>
    <figure>
      <img class="city-icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${iconCode}.svg" alt="${description}">
      <figcaption>${description}</figcaption>
    </figure>
  `;
  li.innerHTML = markup;
  return li;
}

function showInvalidCityMessage() {
  msg.textContent = "Please search for a valid city ";
}
