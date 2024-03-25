import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-imageoverlay-rotated';

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

export function addFloorPlanImage(map, url, transformationMatrix, height, width) {
    if (!map) return;
    let imageUrl = url;

    let bottomLeftMatrix = calculateBoundsMatrix(transformationMatrix, 0, height);
    let upperRightMatrix = calculateBoundsMatrix(transformationMatrix, width, 0);
    let upperLeftMatrix = calculateBoundsMatrix(transformationMatrix, 0, 0);
    
    let bottomLeft = L.latLng(bottomLeftMatrix[1], bottomLeftMatrix[0]);
	let upperRight = L.latLng(upperRightMatrix[1], upperRightMatrix[0]);
	let upperLeft = L.latLng(upperLeftMatrix[1], upperLeftMatrix[0]);

    map.eachLayer(function(layer) {
        if (layer instanceof L.ImageOverlay) {
            map.removeLayer(layer);
        }
    });

    let imageOverlay = L.imageOverlay.rotated(imageUrl, upperLeft, upperRight, bottomLeft, {
        opacity: 0.8,
        interactive: true
    }).addTo(map);

    let marker1 = L.marker(upperLeft, {draggable: true} ).addTo(map);
	let marker2 = L.marker(upperRight, {draggable: true} ).addTo(map);
	let marker3 = L.marker(bottomLeft, {draggable: true} ).addTo(map);
    //marker1.bindPopup(marker1.getLatLng()).openPopup();
    marker1.on('drag dragend', function () {
        repositionImage(imageOverlay, marker1, marker2, marker3)
    });
    marker2.on('drag dragend', function () {
        repositionImage(imageOverlay, marker1, marker2, marker3)
    });
    marker3.on('drag dragend', function () {
        repositionImage(imageOverlay, marker1, marker2, marker3)
    });
}

function calculateBoundsMatrix(transformationMatrix, x, y) {
    let transMatrix = transformationMatrix.map(row => row.map(e => parseFloat(e)));
    let lon = (y * transMatrix[1][0] - x * transMatrix[1][1] - transMatrix[1][0] * transMatrix[2][1] + transMatrix[2][0] * transMatrix[1][1]) / (transMatrix[1][0] * transMatrix[0][1] - transMatrix[0][0] * transMatrix[1][1]);
    let lat = (y * transMatrix[0][0] - x * transMatrix[0][1] - transMatrix[0][0] * transMatrix[2][1]  + transMatrix[2][0] * transMatrix[0][1]) / (transMatrix[0][0] * transMatrix[1][1] - transMatrix[1][0] * transMatrix[0][1]);

    return [lon, lat];
}

function repositionImage(imageOverlay, marker1, marker2, marker3) {
    imageOverlay.reposition(marker1.getLatLng(), marker2.getLatLng(), marker3.getLatLng());
};