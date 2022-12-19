//model
let cityList;
const savedCityList = JSON.parse(localStorage.getItem('cityList'));
if (Array.isArray(savedCityList)) {
    cityList = savedCityList
} else {
    cityList = [
        { name: 'Davis',
        date: '2022-11-12',
        id: 'id1'
        },
        { name: 'San Francisco',
        date: '2022-11-12',
        id: 'id2'
        },
    ]
}
render();

//b973b62226fb5128e50d6ab73540ec56
//https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={b973b62226fb5128e50d6ab73540ec56}
// Creates a city
function createCity(name, date, id) {
    cityList.push( {
        name: name,
        date: date,
        id: ''+id
    })
    saveCities();
}

//Delete a city
function removeCity(idToDelete) {
    cityList = cityList.filter(function(city) {
        //if id is equal city's return false and delete
        //return true otherwise and do nothing
        return !(city.id == idToDelete);
    });
    saveCities();
}

function saveCities() {
    localStorage.setItem('cityList', JSON.stringify(cityList));
}

//controller
function addCity() {
    let cityText = document.getElementById('search-city').value;
    cityText = cityText.charAt(0).toUpperCase() + cityText.slice(1);
    const date = new Date();
    const id = date.getTime();
    createCity(cityText, date.getFullYear()+'/'+(date.getMonth()+1)+"/"+date.getDate(), id)
    render();
}

function findCity() {

    cityList = cityList.filter(function(city) {
        //if id is equal city's return false and delete
        //return true otherwise and do nothing
        return !(city.id == idToDelete);
    });
}

let cityP = document.getElementById('city');
let tempP = document.getElementById('temp');
let weatherP = document.getElementById('weather');
function searchCity(find) {
    let cityText = document.getElementById('search-city').value;
    if (find != null) {
        cityText = find;
    }
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+cityText+"&units=imperial"+'&appid=b973b62226fb5128e50d6ab73540ec56')
    .then((response) => {
    if (!response.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
    }
        return response.json();
    })
    .then(data => {
        if (find == null) {
            addCity();
        }
        cityP.innerText = data['name'];
        tempP.innerText = data['main']['temp']+' °F';
        weatherP.innerText = data['weather'][0]['main'];
    });
}

function deleteCity(event) {
    const deletebutton = event.target;
    const idToDelete = deletebutton.id;
    removeCity(idToDelete);
    render();
}

function viewCity(event) {
    const viewButton = event.target;
    const idToView = viewButton.id;
    cityList.forEach(function (cityTitle) {
        if (cityTitle.id == idToView) {
            searchCity(cityTitle.name);
        }
    });
}

function clearHistory() {
    cityList = [];
    render();
}

// View
function render() { //reset list of cities
    document.getElementById('city-list').innerHTML = '';
    const clearButton = document.createElement('button');
    clearButton.innerText = 'Clear';
    clearButton.style = 'margin-left: 12px';
    clearButton.onclick = clearHistory;
    clearButton.className = "special-button"
    document.getElementById('city-list').appendChild(clearButton)
    cityList.forEach(function (cityTitle) {
        const element = document.createElement('div');
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.style = 'margin-left: 12px';
        deleteButton.id = cityTitle.id;
        deleteButton.className = "special-button";
        element.appendChild(deleteButton);
        deleteButton.onclick = deleteCity;
        const text = document.createElement('h');
        text.style = 'margin-left: 12px';
        text.innerText = cityTitle.name + ' ' + cityTitle.date
        element.appendChild(text);
        const viewButton = document.createElement('button');
        viewButton.innerText = 'View';
        viewButton.style = 'margin-left: 12px';
        viewButton.id = cityTitle.id;
        viewButton.className = "special-button";
        element.appendChild(viewButton);
        viewButton.onclick = viewCity;
        document.getElementById('city-list').appendChild(element)
    });
}