//Quering Data
let query = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
d3.json(query).then(function (data) {
    console.log(data.features);
    // send the data.features object to the createFeatures function.
    createFeatures(data.features);

});

// Determining the markers 
function Color(depth) {
    if (depth < 10) return "green";
    else if (depth < 30) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "red";
  }

function Size(magnitude) {
    return magnitude * 100000;
  }
// Setting the features
function createFeatures(Data) {
    
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            `<h3>Where?</h3>
            <p>${feature.properties.place}</p>
            <hr>
            <h3>When?</h3>
            <p>${new Date(feature.properties.time)}</p>
            <p>Magnitude: ${feature.properties.mag}</p>`);
        }

    let earthquakes = L.geoJSON(Data, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng)
         {
            let geojsonMarker = {
                radius: Size(feature.properties.mag),
                fillColor: Color(feature.geometry.coordinates[2]),
                color: "black",
                weight: 0.5,
                
            };
        
        return L.circle(latlng, geojsonMarker);
        }
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {

    //layer.
    let base = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Assigning the map 
    let myMap = L.map("map", {
        center: [40, -90],
        zoom: 2.5,
        layers: [base, earthquakes]
    });
}
