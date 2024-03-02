import "./App.css";
import React, { useEffect, useState } from "react";

const apiKey = "YourAPIkey";

const cities = [
  { city: "London", lon: "51.509865", lat: "-0.118092" },
  { city: "Toronto", lon: "-79.384293", lat: "43.653908" },
];

function GetWeather() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [foundCity, setFoundCity] = useState(null);
  console.log(data);
  console.log(selected);

  useEffect(() => {
    const found = cities.find((element) => element.city === selected);
    console.log("Found city: ", found);

    if (found) {
      setFoundCity(found.city);
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${found.lat}&lon=${found.lon}&appid=${apiKey}&units=metric`
      )
        .then((response) => {
          console.log(response)
          if(response.ok){
            return response.json();
          }
          else {
            throw Error('Error, failed to fetch api data')
          }
          
        })
        .then((json) => setData(json))
        .catch((error) => console.error(error));
    }
  }, [selected]);

  let weatherTemp, weatherFeelsLike, tempMax, tempMin;

  if (data) {
    weatherTemp = data.list[0].main.temp;
    weatherFeelsLike = data.list[0].main.feels_like;
    tempMax = data.list[0].main.temp_max;
    tempMin = data.list[0].main.temp_min;
  }

  return (
    <div>
      <select
        onChange={(e) => {
          setSelected(e.target.value);
        }}
        defaultValue="Choose City"
        className="form-select"
        aria-label="Default select example"
      >
        <option value="Choose City">Choose City</option>
        <option value="London">London</option>
        <option value="Toronto">Toronto</option>
      </select>
      {data ? (
        <div>
          <div>
            It is {weatherTemp}° in {foundCity}
          </div>
          <div>And Feels Like {weatherFeelsLike}°</div>
          <div>Max Temperature {tempMax}°</div>
          <div>Min Temperature {tempMin}°</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
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
