//Quering Data
let query = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
d3.json(query).then(function (data) {
    console.log(data.features);
    // send the data.features object to the createFeatures function.
    createFeatures(data.features);

});

// Determining the markers 
function Color(depth) {
    if (depth < 0.5) return "green";
    else if (depth < 1) return "greenyellow";
    else if (depth < 1.5) return "yellow";
    else if (depth < 2.5) return "orange";
    else if (depth < 3.5) return "orangered";
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
                fillColor: Color(feature.properties.mag),
                color: "black",
                weight: 0.7,
                
            };
        
        return L.circle(latlng, geojsonMarker);
        }
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {
    //layer
    let base = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Assigning the map 
    let myMap = L.map("map", {
        center: [40, -90],
        zoom: 2.5,
        layers: [base, earthquakes]
    });
    //ADDING LABEL 
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend"),
            mag = [0.5, 1, 1.5, 2.5, 3.5, 5],
            labels = [];

        for (var i = 0; i <mag.length; i++) {
            div.innerHTML +=
            '<i style="background:' + Color(mag[i]) + '"></i> ' + mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
}
