
let baseUrl = 'http://127.0.0.1:5000/'
let allFires = 'api/v1.0/fires/1976/2023'

let dropdownURL = baseUrl + allFires
var markers = [];

function formatKey (key) {
    return key
}



function changeOutput (year){

    let changeUrl = baseUrl + '/api/v1.0/fires/' + year
    let yearGroupFireUrl = baseUrl + '/api/v1.0/fires/' + year + '/' + year
    let yearGroupClimateUrl = baseUrl + '/api/v1.0/climate/' + year + '/' + year


    // Call for the fire data for the year in question
    d3.json(changeUrl).then(function(fireYearData) {
        
        console.log(year)

        // Remove the markers from the existing map
        markers.forEach(function(marker) {
            yearlyMap.removeLayer(marker);
        });

        // Add the markers to the map for the year called from dropdown
        for (let fire in fireYearData) {
            var marker = L.circle([fireYearData[fire].Y, fireYearData[fire].X], {
                fillOpacity: 0.55,
                fillColor: "red",
                radius: fireYearData[fire].FIRE_FINAL_SIZE
            }).bindPopup(`<h1>${fireYearData[fire].FIRE_START_DATE}</h1>`).addTo(yearlyMap);
            markers.push(marker);
            
        };

        d3.json(yearGroupFireUrl).then(function(fireYearGroupData) {

            // let info = fireYearGroupData
            let infoPanel = d3.select("#year-info").html("");
            // console.log(info)
            var info = fireYearGroupData[0];
            var keys = Object.keys(info);
            console.log(keys)
            let infoTitle = d3.select(".panel-heading").html("");
            infoTitle.append("h5").text(`Yearly Data for ${info._id}`);

            let mapTitle = d3.select("#map-title").html("");
            mapTitle.append("h3").text(`Wildfires in Ontario in ${info._id}`);


            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key != '_id') {
                    infoPanel.append("h6").text(`${formatKey(key)}: ${info[key]}`);
                }
            };

            d3.json(yearGroupClimateUrl).then(function(climateYearGroupData) {
                console.log(climateYearGroupData)
                var climateInfo = climateYearGroupData[0];
                var climateKeys = Object.keys(climateInfo);

                for (key in climateKeys) {
                    console.log(climateInfo)
                    if (climateKeys[key] != '_id') {
                        infoPanel.append("h6").text(`${formatKey(climateKeys[key])}: ${climateInfo[climateKeys[key]]}`);
                    }
                }
            });
        });
    }
)};

function updateDashboard(year) {
    changeOutput(year);
  };

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