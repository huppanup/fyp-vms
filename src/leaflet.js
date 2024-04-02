import L, { imageOverlay } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-imageoverlay-rotated';
import numeric from 'numeric';

export function initializeMap() {
    const mapContainer = document.getElementById("mapContainer");
    if (mapContainer) {
        if (mapContainer._leaflet_id) {
            let parentElement = mapContainer.parentElement;
            parentElement.removeChild(mapContainer);
            parentElement.innerHTML = '<div id="mapContainer"></div>';
        }
    }
    let map = L.map('mapContainer').setView([22.3021, 114.1675], 19);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 25,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.on('click', function(e) {
        alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    });

    return map;
}

export function calculateFloorPlanImage(map, url, transformationMatrix, height, width) {
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

    return {imageOverlay, bottomLeft, upperRight, upperLeft};
}

export function loadFloorPlanImage(map, url, bottomLeftMatrix, upperRightMatrix, upperLeftMatrix) {
    if (!map) return;
    let imageUrl = url;

    let bottomLeft = L.latLng(bottomLeftMatrix["lat"], bottomLeftMatrix["lng"]);
	let upperRight = L.latLng(upperRightMatrix["lat"], upperRightMatrix["lng"]);
	let upperLeft = L.latLng(upperLeftMatrix["lat"], upperLeftMatrix["lng"]);

    map.eachLayer(function(layer) {
        if (layer instanceof L.ImageOverlay) {
            map.removeLayer(layer);
        }
    });

    let imageOverlay = L.imageOverlay.rotated(imageUrl, upperLeft, upperRight, bottomLeft, {
        opacity: 0.8,
        interactive: true
    }).addTo(map);

    return imageOverlay;

}

export function addAlignmentMarkers(map, imageOverlay, bottomLeftMatrix, upperRightMatrix, upperLeftMatrix) {

    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    let bottomLeft = L.latLng(bottomLeftMatrix["lat"], bottomLeftMatrix["lng"]);
	let upperRight = L.latLng(upperRightMatrix["lat"], upperRightMatrix["lng"]);
	let upperLeft = L.latLng(upperLeftMatrix["lat"], upperLeftMatrix["lng"]);

    let marker1 = L.marker(upperLeft, {draggable: true} ).addTo(map);
	let marker2 = L.marker(upperRight, {draggable: true} ).addTo(map);
	let marker3 = L.marker(bottomLeft, {draggable: true} ).addTo(map);
    marker1.on('drag dragend', function () {
        repositionImage(imageOverlay, marker1, marker2, marker3)
    });
    marker2.on('drag dragend', function () {
        repositionImage(imageOverlay, marker1, marker2, marker3)
    });
    marker3.on('drag dragend', function () {
        repositionImage(imageOverlay, marker1, marker2, marker3)
    });

    return [marker1, marker2, marker3];
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

export function calculateTransformationMatrix(bottomLeft, upperRight, upperLeft, height, width) {
    
    const A = [
        [parseFloat(bottomLeft["lng"]), parseFloat(bottomLeft["lat"]), 1, 0, 0, 0],
        [0, 0, 0, parseFloat(bottomLeft["lng"]), parseFloat(bottomLeft["lat"]), 1],
        [parseFloat(upperRight["lng"]), parseFloat(upperRight["lat"]), 1, 0, 0, 0],
        [0, 0, 0, parseFloat(upperRight["lng"]), parseFloat(upperRight["lat"]), 1],
        [parseFloat(upperLeft["lng"]), parseFloat(upperLeft["lat"]), 1, 0, 0, 0],
        [0, 0, 0, parseFloat(upperLeft["lng"]), parseFloat(upperLeft["lat"]), 1]
    ];

    const B = [0, height, width, 0, 0, 0];

    const x = numeric.solve(A, B);
    const transformationMatrix = [
        [x[0], x[3]],
        [x[1], x[4]],
        [x[2], x[5]]
    ];
    return transformationMatrix;
    
}

export function removeMarkers(map) {
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
}