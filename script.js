// form user input
const userInputForm = document.querySelector("form");

userInputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = userInputForm.querySelector("input").value;
  getWeatherData(location);
});

// weather api
async function getWeatherData(location) {
  const apiKey = "f5dbff6b0de347cd86d101159232712";
  try {
    //3 days forecast don't give me an error even for current so should be fine
    let url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;
    const response = await fetch(url, { mode: "cors" });

    if (!response.ok) {
      // try again with auto for location miss typed or so  but needs a user-message
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const processedData = processWeatherData(data);
    displayWeather(processedData);
    return processedData;
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

function processWeatherData(rawData) {
  let currentData = {
    [`now`]: {
      location: rawData.location.name,
      localionRegion: rawData.location.region,
      date: rawData.forecast.forecastday[0].date,
      condition: rawData.current.condition.text,
      conditionIcon: rawData.current.condition.icon,
      temp: rawData.current.temp_c,
      wind: rawData.current.wind_kph,
      humidity: rawData.current.humidity,
    },
  };
  rawData.forecast.forecastday.forEach((day, index) => {
    currentData[`${index}`] = {
      date: day.date,
      condition: day.day.condition.text,
      conditionIcon: day.day.condition.icon,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
    };
  });

  return currentData;
}

function displayWeather(data) {
  console.log(data);

  const now = document.querySelector(".now");
  now.querySelector(".location").textContent = data.now.location;
  now.querySelector("img").src = data.now.conditionIcon;
  now.querySelector(".temp").textContent = data.now.temp;
  now.querySelector(".condition").textContent = data.now.condition;
  now.querySelector(".wind").textContent = data.now.wind;
  now.querySelector(".humidity").textContent = data.now.humidity;

  const forecast = document.querySelectorAll(".forecast");
  forecast.forEach((forecast) => {
    let forecastDay;
    if (forecast.classList.contains("today")) {
      forecastDay = 0;
      forecast.querySelector(".date").textContent =
        "Today " + formatDateShort(data[forecastDay].date);
    } else if (forecast.classList.contains("tomorrow")) {
      forecastDay = 1;
      forecast.querySelector(".date").textContent = formatDateShort(
        data[forecastDay].date
      );
    } else if (forecast.classList.contains("twoDays")) {
      forecastDay = 2;
      forecast.querySelector(".date").textContent = formatDateShort(
        data[forecastDay].date
      );
    }

    forecast.querySelector("img").src = data[forecastDay].conditionIcon;
    forecast.querySelector(".condition").textContent =
      data[forecastDay].condition;
    forecast.querySelector(".min-temp").textContent = data[forecastDay].minTemp;
    forecast.querySelector(".max-temp").textContent = data[forecastDay].maxTemp;
  });
}

window.addEventListener("load", () => {
  getWeatherData("Berlin");
});

function formatDateShort(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; //
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;
  return formattedDay + "." + formattedMonth;
}
// todo error handling
