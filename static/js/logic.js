var mymap = L.map('map').setView([37.09, -95.71], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mapkey,
}).addTo(mymap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data){
    //console.log(latlng)
    

    function markercolor(magnitude) {
        switch (true) {
        case magnitude > 5:
          return "#e309c6";
        case magnitude > 4:
          return "#096fe3";
        case magnitude > 3:
          return "#09e352";
        case magnitude > 2:
          return "#e3b709";
        case magnitude > 1:
          return "#8509e3";
        default:
          return "#98ee00";
        }
      }

      function markersize(magnitude){
          if (magnitude === 0){
              return 1
          } 

          return magnitude * 3
      }
      function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: markercolor(feature.properties.mag),
          color: "#000000",
          radius: markersize(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }


    L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(mymap);

  var legend = L.control({position: "topright"});

  // Then add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = ["#98ee00","#8509e3",  "#e3b709" , "#09e352", "#096fe3", "#e309c6"];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(mymap);

})