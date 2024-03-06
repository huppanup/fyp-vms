import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { transpose, multiply, inv, atan2 } from 'mathjs';
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

export function addFloorPlanImage(map, url, geoPoints, pixelPoints, height, width) {
    console.log(map);
    if (!map) return;
    let imageUrl = url;
    let bounds = calculateBounds(geoPoints, pixelPoints, height, width);
    let bottomLeft = L.latLng(bounds[0][0], bounds[0][1]);
	let upperRight = L.latLng(bounds[1][0], bounds[1][1]);
	let upperLeft = L.latLng(bounds[2][0], bounds[2][1]);

    map.eachLayer(function(layer) {
        if (layer instanceof L.ImageOverlay) {
            map.removeLayer(layer);
        }
    });
    geoPoints.forEach(element => {
        var marker = new L.marker([element[1], element[0]]).addTo(map);
    });
    let imageOverlay = L.imageOverlay.rotated(imageUrl, upperLeft, upperRight, bottomLeft, {
        opacity: 0.6,
        interactive: true
    }).addTo(map);
    //imageOverlay.getElement().style.transform += " rotate(" + rotation + "deg)";

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

function repositionImage(imageOverlay, marker1, marker2, marker3) {
    imageOverlay.reposition(marker1.getLatLng(), marker2.getLatLng(), marker3.getLatLng());
};

function calculateBounds(geoPoints, pixelPoints, height, width) {
    const matrix = calculateAffineTransformationMatrix(pixelPoints, geoPoints);

    console.log(matrix);

    const lowerLeft = applyAffineTransform(matrix, 0, height);
    const upperRight = applyAffineTransform(matrix, width, 0);
    const upperLeft = applyAffineTransform(matrix, 0, 0);

    console.log(lowerLeft);
    console.log(upperRight);
    console.log(upperLeft);

    return [[lowerLeft.latitude, lowerLeft.longitude], [upperRight.latitude, upperRight.longitude], [upperLeft.latitude, upperLeft.longitude]];
}

function calculateAffineTransformationMatrix(pixelPoints, geoPoints) {
    const numPoints = pixelPoints.length;
    const A = [];
    const B = [];
  
    for (let i = 0; i < numPoints; i++) {
      const [x, y] = pixelPoints[i];
      const [longitude, latitude] = geoPoints[i];
  
      A.push([x, y, 1, 0, 0, 0]);
      A.push([0, 0, 0, x, y, 1]);
  
      B.push(longitude);
      B.push(latitude);
    }
  
    const AT = transpose(A);
    const ATA = multiply(AT, A);
    const ATB = multiply(AT, B);
    const ATAInverse = inv(ATA);
    const X = multiply(ATAInverse, ATB);
  
    const matrix = [
      [X[0], X[1], X[2]],
      [X[3], X[4], X[5]],
      [0, 0, 1]
    ];
  
    return matrix;
}

function applyAffineTransform(matrix, x, y) {
    const result = multiply(matrix, [x, y, 1]);
    console.log(result);
  
    const longitude = result[0];
    const latitude = result[1];
  
    return { longitude, latitude };
}