// let try first with promise then convert it to async ?
const apiKey = "f5dbff6b0de347cd86d101159232712";

// function getWeatherData(mode = "current", location, optional) {
//   fetch(
//     `https://api.weatherapi.com/v1/${mode}.json?key=${apiKey}&q=${location}`,
//     {
//       mode: "cors",
//     }
//   ).then(function (response) {
//     console.log(response.json());
//   });
// }

async function getWeatherData(mode = "current", location) {
  try {
    //3 days forecast don't give me an error even for current so should be fine
    let url = `https://api.weatherapi.com/v1/${mode}.json?key=${apiKey}&q=${location}&days=3`;
    const response = await fetch(url, { mode: "cors" });
    console.log(response);
    if (!response.ok) {
      // try again with auto for location miss typed or so  but needs a user-message
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    processWeatherData(data);
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

function processWeatherData(rawData) {
  console.log(`processData with: `);
  console.log(rawData);
  let currentData = {
    [`today`]: {
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

  console.log(currentData);
}

getWeatherData("forecast", "lübeck");
// getWeatherData("forecast", "ladds");
