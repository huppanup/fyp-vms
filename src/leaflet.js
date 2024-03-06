import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { transpose, multiply, inv, atan2 } from 'mathjs';

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
    let rotation = Math.atan2((bounds[1][0] - bounds[0][0]), (bounds[1][1] - bounds[0][1])) * (180 / Math.PI);
    console.log(rotation);
    let latLngBounds = L.latLngBounds([bounds]);
    map.eachLayer(function(layer) {
        if (layer instanceof L.ImageOverlay) {
            map.removeLayer(layer);
        }
    });
    /*geoPoints.forEach(element => {
        var marker = new L.marker([element[1], element[0]]).addTo(map);
    });*/

    let marker1 = L.marker(bounds[0], {
        draggable: true
    }).addTo(map);
    
    let marker2 = L.marker(bounds[1], {
        draggable: true
    }).addTo(map);
    
    let imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
        opacity: 0.6,
        interactive: true
    }).addTo(map);
    //imageOverlay.getElement().style.transform += " rotate(" + rotation + "deg)";
}

function calculateBounds(geoPoints, pixelPoints, height, width) {
    const matrix = calculateAffineTransformationMatrix(pixelPoints, geoPoints);

    const lowerLeft = applyAffineTransform(matrix, 0, height);
    const upperRight = applyAffineTransform(matrix, width, 0);

    console.log(lowerLeft);
    console.log(upperRight);

    return [[lowerLeft.latitude, lowerLeft.longitude], [upperRight.latitude, upperRight.longitude]];
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
  
    const longitude = result[0];
    const latitude = result[1];
  
    return { longitude, latitude };
}