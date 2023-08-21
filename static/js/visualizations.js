
let baseUrl = 'http://127.0.0.1:5000/'
let allFires = 'api/v1.0/fires/1976/2023'

let dropdownURL = baseUrl + allFires


function changeOutput (year){

    let changeUrl = baseUrl + '/api/v1.0/fires/' + year

    d3.json(changeUrl).then(function(data) {
        console.log(year)
    });
};



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