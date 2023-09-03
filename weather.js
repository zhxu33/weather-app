let cityList;
const savedCityList = JSON.parse(localStorage.getItem("cityList"));
if (Array.isArray(savedCityList)) {
  cityList = savedCityList;
} else {
  cityList = ["San Francisco", "Davis"];
}
render();

function createCity(name) {
  cityList.push(name);
  saveCities();
}

function removeCity(name) {
  cityList = cityList.filter(function (city) {
    return !(city == name);
  });
  saveCities();
}

function saveCities() {
  localStorage.setItem("cityList", JSON.stringify(cityList));
}

function addCity(cityText) {
  if (cityList.includes(cityText) == false) {
    createCity(cityText);
    render();
  }
}

let cityP = document.getElementById("city");
let tempP = document.getElementById("temp");
let weatherP = document.getElementById("weather");
let tempstatP = document.getElementById("tempstat");
function searchCity(find) {
  let cityText = document.getElementById("search-city").value;
  if (find != null) {
    cityText = find;
  }
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityText +
      "&units=imperial" +
      "&appid=b973b62226fb5128e50d6ab73540ec56"
  )
    .then((response) => {
      if (!response.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      return response.json();
    })
    .then((data) => {
      if (find == null) {
        addCity(data["name"]);
      }
      cityP.innerText = data["name"];
      tempP.innerText = Math.round(data["main"]["temp"]) + "°";
      weatherP.innerText = data["weather"][0]["main"];
      tempstatP.innerText =
        "L:" +
        Math.round(data["main"]["temp_min"]) +
        "° " +
        "H:" +
        Math.round(data["main"]["temp_max"]) +
        "°";
      document.body.style.backgroundImage =
        "url('" +
        "https://source.unsplash.com/1600x900/?" +
        cityText +
        "%20city')";
    });
}

function deleteCity(event) {
  const parent = event.target.parentElement;
  const cityName = parent.getElementsByClassName("sample-city")[0];
  removeCity(cityName.textContent);
  parent.remove();
  render();
}

function viewCity(event) {
  const parent = event.target.parentElement;
  const cityName = parent.getElementsByClassName("sample-city")[0];
  searchCity(cityName.textContent);
}

function starCity(event) {
  const parent = event.target.parentElement;
  const cityName = parent.getElementsByClassName("sample-city")[0];
  removeCity(cityName.textContent);
  cityList.unshift(cityName.textContent);
  saveCities();
  render();
}

function clearHistory() {
  cityList = [];
  saveCities();
  render();
}

function render() {
  const list = document.getElementById("city-list");
  const sample = document.getElementById("samp");
  while (list.lastElementChild) {
    if (list.lastElementChild.className == "sample") {
      list.removeChild(list.lastElementChild);
    } else {
      break;
    }
  }
  document.getElementById("clear-button").onclick = clearHistory;
  cityList.forEach(function (cityTitle) {
    let element = sample.cloneNode(true);
    element.removeAttribute("id");
    element.className = "sample";
    element.getElementsByClassName("sample-delete")[0].onclick = deleteCity;
    element.getElementsByClassName("sample-view")[0].onclick = viewCity;
    element.getElementsByClassName("sample-star")[0].onclick = starCity;
    element.getElementsByClassName("sample-city")[0].textContent = cityTitle;
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityTitle +
        "&units=imperial" +
        "&appid=b973b62226fb5128e50d6ab73540ec56"
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        element.getElementsByClassName("sample-temp")[0].innerText =
          Math.round(data["main"]["temp"]) + "°";
        element.getElementsByClassName("sample-weather")[0].innerText =
          data["weather"][0]["main"];
      });
    document.getElementById("city-list").appendChild(element);
  });
}

document.addEventListener("readystatechange", () => {
  if (document.readyState == "complete") {
    if (cityList[0]) {
      searchCity(cityList[0]);
    } else {
      searchCity("San Francisco");
    }
  }
});
