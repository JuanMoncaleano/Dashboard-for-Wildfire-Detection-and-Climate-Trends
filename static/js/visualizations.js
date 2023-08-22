
let baseUrl = 'http://127.0.0.1:5000/'
let allFires = 'api/v1.0/fires/1976/2023'

let dropdownURL = baseUrl + allFires
var fireMarkers = [];
var climateMarkers = [];

// var map = new L.Map('yearlyMap', {worldMiniMapControl: true});


var dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

// This adjusts the keys to be more digestible for the info panel
function formatKey (key) {
    if (key == 'count') {
        return 'Number of fires'
    } else if (key == 'total_burn') {
        return 'Total hectares burned'
    } else if (key == 'mean_temp') {
        return 'Mean temperature'
    } else if (key == 'precip') {
        return 'Total precipitation'
    } else {
        return key
    }
}

function formatValues (value) {
    return value.toLocaleString('en-US')
}

// Custom weather station markers declaration
var weatherMarker = L.ExtraMarkers.icon({
    icon: 'fa-umbrella', 
    markerColor: 'green',
    shape: 'circle',
    prefix: 'fa'
  });

// This formats the fire date for popup
function formatDate (fireDate) {
    var dateToFix = new Date(fireDate.slice(0, 10));
    return dateToFix.toLocaleDateString('en-US', dateOptions)
}

// This formats the fire size for popup
function formatSize (fireSize) {
    // reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
    return fireSize.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function adjustRadius (radius) {
    if (radius < 10) {
        return radius * 100
    } else {
        return radius
    }
}

// function fixInfoPanel (info) {

// }


function changeOutput (year){

    // API routes for the changing data
    let changeFireUrl = baseUrl + '/api/v1.0/fires/' + year
    let changeClimateUrl = baseUrl + '/api/v1.0/climate/' + year
    let yearGroupFireUrl = baseUrl + '/api/v1.0/fires/' + year + '/' + year
    let yearGroupClimateUrl = baseUrl + '/api/v1.0/climate/' + year + '/' + year
    let yearClimateFireSeason = baseUrl + '/api/v1.0/climate/month/' + year + '/' + year

    // Call for the fire points data for the year in question
    d3.json(changeFireUrl).then(function(fireYearData) {
        
        // console.log(year)

        // Remove the markers from the existing map
        fireMarkers.forEach(function(marker) {
            yearlyMap.removeLayer(marker);
        });

        // Add the markers to the map for the year called from dropdown
        for (let fire in fireYearData) {
            var marker = L.circle([fireYearData[fire].Y, fireYearData[fire].X], {
                fillOpacity: 0.55,
                fillColor: "red",
                weight: 0.5,
                color: "red",
                radius: adjustRadius(fireYearData[fire].FIRE_FINAL_SIZE)
            }).bindPopup(`<h4>${formatDate(fireYearData[fire].FIRE_START_DATE)}</h4>\
                <hr>\
                <h5>Fire size: ${formatSize(fireYearData[fire].FIRE_FINAL_SIZE)} ha </h5>`).addTo(yearlyMap);
            fireMarkers.push(marker);
        };

        // Call the weather station data for the year from the dropdown
        d3.json(changeClimateUrl).then(function(climateYearData) {

            // Clear the previous markers
            climateMarkers.forEach(function(marker2) {
                yearlyMap.removeLayer(marker2);
            });

            // console.log(climateYearData)

            // Add the weather stations to the map with custom marker
            for (let station in climateYearData) {
                var marker2 = L.marker([climateYearData[station].lat, climateYearData[station].lon], { 
                    icon: weatherMarker 
                }).bindPopup(`<h4>${climateYearData[station]._id}</h4> <hr>\
                    <h5>Total precipitation: ${formatSize(climateYearData[station].precip)}</h5>\
                    <h5>Mean Temperature: ${formatSize(climateYearData[station].mean_temp)}</h5>\
                    `).addTo(yearlyMap);
                climateMarkers.push(marker2);
            };

        });

        // Call the grouped fire data for the info panel
        d3.json(yearGroupFireUrl).then(function(fireYearGroupData) {

            let infoPanel = d3.select("#year-info").html("");
            var info = fireYearGroupData[0];
            var keys = Object.keys(info);
            // console.log(keys)
            let infoTitle = d3.select(".panel-heading").html("");
            infoTitle.append("h5").text(`Yearly Data for ${info._id}`);

            let mapTitle = d3.select("#map-title").html("");
            mapTitle.append("h3").text(`Wildfires in Ontario in ${info._id}`);


            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key != '_id') {
                    infoPanel.append("h6").text(`${formatKey(key)}: ${formatValues(info[key])}`);
                }
            };

            // Call the grouped climate data for the info panel
            d3.json(yearGroupClimateUrl).then(function(climateYearGroupData) {
                // console.log(climateYearGroupData)
                var climateInfo = climateYearGroupData[0];
                var climateKeys = Object.keys(climateInfo);

                for (key in climateKeys) {
                    // console.log(climateInfo)
                    if (climateKeys[key] != '_id') {
                        infoPanel.append("h6").text(`${formatKey(climateKeys[key])}: \
                        ${formatValues(climateInfo[climateKeys[key]])}`);
                    }
                }
            });
        });
    }
)};

// Looks for the dropdown to change to update viz
function updateDashboard(year) {
    changeOutput(year);
  };

// Initializes map and dropdown
function init (){
    
    d3.json(dropdownURL).then(function(data) {
  
        let dropDown = d3.select("#selYear");
  
        const yearList = data.map(item => item._id);

        for (let n = 0; n < yearList.length; n++) {
            dropDown.append("option").text(yearList[n]).property("value", yearList[n]);
            };

        changeOutput(1976); 
    });
};
  
  
init();