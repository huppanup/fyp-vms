import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function initializeMap() {
    const mapContainer = document.getElementById("mapContainer");
    if (mapContainer) {
        if (mapContainer._leaflet_id) {
            let parentElement = mapContainer.parentElement;
            parentElement.removeChild(mapContainer);
            parentElement.innerHTML = '<div id="mapContainer"></div>';
        }
    }
    let map = L.map('mapContainer').setView([22.3015, 114.1668], 19);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 25,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.on('click', function(e) {
        alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    });

    return map;
}

export function addFloorPlanImage(map, url, transformation, matrix, height, width) {
    console.log(map);
    if (!map) return;
    let imageUrl = url;
    let bounds = calculateBounds(transformation, matrix, height, width);
    let latLngBounds = L.latLngBounds([bounds]);
    map.eachLayer(function(layer) {
        if (layer instanceof L.ImageOverlay) {
            map.removeLayer(layer);
        }
    });
    let imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
        opacity: 0.9,
        interactive: true
    }).addTo(map);
}

function calculateBounds(transformation, matrix, height, width) {
    let pixelWidth = matrix[1][0] - matrix[0][0];
    let pixelHeight = matrix[1][1] - matrix[0][1];
    let longitudeRange = transformation[1][0] - transformation[0][0];
    let latitudeRange = transformation[1][1] - transformation[0][1];

    console.log(longitudeRange / pixelWidth);

    let lowerLeftBound = [parseFloat(transformation[0][1] + (latitudeRange / pixelHeight) * (height - matrix[0][1])), parseFloat(transformation[0][0] + (longitudeRange / pixelWidth) * matrix[0][0])];
    let upperRightBound = [parseFloat(transformation[0][1] - (latitudeRange / pixelHeight) * matrix[0][1]), parseFloat(transformation[0][0] - (longitudeRange / pixelWidth) * (width - matrix[0][0]))];

    console.log(lowerLeftBound);
    console.log(upperRightBound);
    return [lowerLeftBound, upperRightBound];
}