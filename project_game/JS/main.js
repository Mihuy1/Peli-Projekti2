'use strict';

// Leaflet map
const map = L.map('map', {tap: false});
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);
map.setView([-50, 0], 1);

const data = 'http://127.0.0.1:5000/get_airports';
const airportsInRange = 'http://127.0.0.1:5000/airports_in_range';
const  pawYellowIcon = L.icon({
    iconUrl: 'CSS/paw_yellow.png',
    iconSize:     [15, 15], // size of the icon
    iconAnchor:   [-7, -3], // point of the icon which will correspond to marker's location
    popupAnchor:  [15, 15] // point from which the popup should open relative to the iconAnchor
});
const  pawGreenIcon = L.icon({
    iconUrl: 'CSS/paw_green.png',
    iconSize:     [15, 15], // size of the icon
    iconAnchor:   [-7, -3], // point of the icon which will correspond to marker's location
    popupAnchor:  [15, 15] // point from which the popup should open relative to the iconAnchor
});
const modal = document.getElementById("video");
const cat = document.getElementById("cat");
const airportMarkers = L.featureGroup().addTo(map);
const buttons = document.querySelector('.buttons')
// form for player name
document.querySelector('#player-form').addEventListener('submit', function (evt) {
  evt.preventDefault();
  const playerName = document.querySelector('#player-input').value;
  document.querySelector('#player-modal').classList.add('hide');
  //gameSetup(`${apiUrl}newgame?player=${playerName}&loc=${startLoc}`);
});

// function to fetch data from API
async function getData() {
    const response = await fetch(data);
    if (!response.ok) throw new Error('Invalid server input!');
    const responseData = await response.json();
    console.log(responseData);

    for (let airport of responseData) {
        const marker = L.marker([airport.latitude_deg, airport.longitude_deg]).addTo(map);
        airportMarkers.addLayer(marker);
        marker.setIcon(pawYellowIcon);
        let button = document.createElement('button');
        button.className = 'block';
        button.appendChild(document.createTextNode(airport.name));
        buttons.appendChild(button);
        const popupContent = document.createElement('div');
        const h4 = document.createElement('h4');
        h4.innerHTML = airport.name;
        popupContent.append(h4);
        const goButton = document.createElement('button');
        goButton.classList.add('button');
        goButton.innerHTML = 'Fly here';
        popupContent.append(goButton);
        const p = document.createElement('p');
        p.innerHTML = `Distance ${airport.distance}km`;
        popupContent.append(p);
        marker.bindPopup(popupContent);
        goButton.addEventListener('click', function () {
            gameSetup(`${apiUrl}flyto?game=${data.status.id}&dest=${airport.ident}`);
        });
        button.addEventListener('mouseover', function (evt) {
          marker.setIcon(pawGreenIcon);
            });
        button.addEventListener('mouseout', function (evt) {
          marker.setIcon(pawYellowIcon);
            });
    }
}

getData();
setTimeout(function () {
    window.dispatchEvent(new Event("resize"));
}, 500);
setTimeout(map);

document.addEventListener('click', function (event) {
    if (event.target.id === 'cat') {
        cat.style.width = '35%';
        modal.style.display = "block";
        document.getElementById("joey").play();
        setTimeout(function () {
            modal.style.display = "none";
            }, 7000);

    }

});


async function inRange() {
    const response = await fetch(airportsInRange);
    if (!response.ok) throw new Error('Invalid server input!');
    const responseData = await response.json();
}

// function to update game status

// function show weather at selected airport

// function to check if any goals have been reached

// function to update event data and event table in UI

// function to check if game is over

// function to set up game (main function) <---
