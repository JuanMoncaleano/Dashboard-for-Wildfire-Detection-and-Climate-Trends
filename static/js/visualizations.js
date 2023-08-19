let myMap = L.map("map", {
    center: [
      47.09, -110.71
    ],
    zoom: 4,
    layers: [grayScale, earthquakes]
  });


  // function changeOutput (sample){
  //   d3.json(url).then(function(data) {
  
  //   // Bar chart
      
  
  
  //   // Bubble Chart 
  
  
  //   // Demographics
      
  
  
  //   // Gauge Chart
      
  
  //   });
  // };
  


let baseUrl = 'http://127.0.0.1:5000/api/v1.0/'
let climateUrl = 'climate'
let fireUrl = 'fire'
let datesUrl = ''
let fullUrl = ''



d3.json('baseUrl').then(function(response) {
    console.log(response);
    //create a new marker cluster group
    // var markers = L.markerClusterGroup({
      
    // });
    // console.log(markers);
    
    // for (var i = 0; i<response.length; i++){
      
    //   var location = response[i];
      
    //   if (location){
    //     console.log(location);
        
        
    //     markers.addLayer(L.marker([location.Latitude, location.Longitude])
    //     .bindPopup(location[''] + '<br/>' + location.Latitude + ', ' + location.Longitude));
    //   }
  
    //   }
    //   map.addLayer(markers);  
  });

