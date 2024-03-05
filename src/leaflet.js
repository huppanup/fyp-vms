import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

let map;
let imageOverlay;

export function initializeMap() {
    if (map) return;
    map = L.map('mapContainer').setView([22.3015, 114.1668], 19);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 25,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.on('click', function(e) {
        alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    });
}

export function addFloorPlanImage(url, transformation, matrix, height, width) {
    let imageUrl = url;
    let bounds = calculateBounds(transformation, matrix, height, width);
    let latLngBounds = L.latLngBounds([bounds]);
    if (imageOverlay) {
        map.removeLayer(imageOverlay);
    }
    imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
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