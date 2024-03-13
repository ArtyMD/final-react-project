import "./App.css";
import React, { useEffect, useState } from "react";
import Spinner from "./Components/Spinner/Spinner";

const apiKey = "7c23a27119e9681a7c0d9dfd5955bc76";

const cities = [
  { city: "London", lat: "51.509865", lon: "-0.118092" },
  { city: "Toronto", lat: "43.653908", lon: "-79.384293" },
  { city: "Moscow", lat: "55.755826", lon: "37.617300" },
  { city: "Chisinau", lat: "47.010453", lon: "28.863810" },
  { city: "Tokyo", lat: "35.689487", lon: "139.691711" },
];

function GetWeather() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [foundCity, setFoundCity] = useState(null);
  const [forecast, setForecast] = useState("");
  // console.log(data);
  // console.log(selected);

  useEffect(() => {
    const found = cities.find((element) => element.city === selected);

    if (found) {
      setFoundCity(found.city);
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${found.lat}&appid=${apiKey}&lon=${found.lon}&units=metric`
      )
        .then((response) => {
          console.log(response);
          if (response.ok) {
            return response.json();
          } else {
            throw Error("Error, failed to fetch api data");
          }
        })
        .then((json) => setData(json))
        .catch((error) => console.error(error));
    }
  }, [selected, forecast]);

  let weatherTemp,
    weatherFeelsLike,
    tempMax,
    tempMin,
    threeHourWeather,
    fiveDayForecast;

  if (data) {
    weatherTemp = data.list[0].main.temp;
    weatherFeelsLike = data.list[0].main.feels_like;
    tempMax = data.list[0].main.temp_max;
    tempMin = data.list[0].main.temp_min;
    threeHourWeather = [
      data.list[1],
      data.list[2],
      data.list[3],
      data.list[4],
      data.list[5],
    ];
    fiveDayForecast = data.list;
  }

  console.log(data);
  function handleClick(a) {
    setForecast(a);
  }

  const filteredArrays = fiveDayForecast
    ? fiveDayForecast.filter((_, index) => (index + 6 ) % 8 === 1)
    : [];

  function DayOfWeek(timestamp) {
    const [datePart, timePart] = timestamp.split(" ");

    const [year, month, day] = datePart.split("-");

    const date = new Date(year, month - 1, day); // month - 1 because months are 0-indexed in JavaScript

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = days[date.getDay()];

    return (
      <div>
        <p>{dayOfWeek}</p>
      </div>
    );
  }

  function convertTimeToAMPM(timeString) {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const convertedHours = hours % 12 || 12;
    return `${convertedHours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;
  }

  return (
    <>
      <select
        onChange={(e) => {
          setSelected(e.target.value);
        }}
        defaultValue="Choose City"
        className="form-select"
        aria-label="Default select example"
      >
        <option value="Selected City">Select City</option>
        <option value="London">London</option>
        <option value="Toronto">Toronto</option>
        <option value="Moscow">Moscow</option>
        <option value="Chisinau">Chisinau</option>
        <option value="Tokyo">Tokyo</option>
      </select>
      <div className="button-wrapper">
        <button
          onClick={() => handleClick("current")}
          value={"Current Weather"}
          className="forecast-option-btn"
        >
          Current Weather
        </button>
        <button
          onClick={() => handleClick("3h")}
          value={"3h"}
          className="forecast-option-btn"
        >
          3 Hour Forcast
        </button>
        <button
          onClick={() => handleClick("5d")}
          value={"5d"}
          className="forecast-option-btn"
        >
          5 Day Forcast
        </button>
      </div>

      {data ? (
        <div className="forecastWrapper">
          {forecast === "current" && (
            <div className="forecastWrapper2">
              <div className="mainWeather">
                <div className="city">{foundCity}</div>
                {Math.round(weatherTemp)}°
              </div>
              <div className="secondaryWeather">
                <div className="tempBlock">
                  {Math.round(weatherFeelsLike)}°{" "}
                  <div className="tempBlockTxt">Feels Like</div>
                </div>
                <div className="tempBlock">
                  {Math.round(tempMax)}°{" "}
                  <div className="tempBlockTxt">High</div>
                </div>
                <div className="tempBlock">
                  {Math.round(tempMin)}° <div className="tempBlockTxt">Low</div>
                </div>
              </div>
            </div>
          )}
          {forecast === "3h" && (
            <div className="row-wrapper">
              <div className="threeHourWrapper-rows">
                {threeHourWeather.map((weather) => (
                  <>
                    <div className="threeHourWrapper-details">
                      <div className="temperature ">
                        {Math.round(weather.main.temp)}°
                      </div>
                      <div className="time">
                        {convertTimeToAMPM(weather.dt_txt)}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          )}
          {forecast === "5d" && (
            <div className="row-wrapper">
              <div className="threeHourWrapper-rows">
                {filteredArrays.map((weather) => (
                  <>
                    <div className="threeHourWrapper-details">
                      <div className="temperature ">
                        {Math.round(weather.main.temp)}°
                      </div>
                      <div className="time">{DayOfWeek(weather.dt_txt)}</div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <GetWeather />
    </div>
  );
}

export default App;
