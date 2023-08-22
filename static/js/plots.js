d3.json('http://127.0.0.1:5000/api/v1.0/fires/season/1977/2022').then(function(fireData) {
    d3.json('http://127.0.0.1:5000/api/v1.0/climate/season/1977/2022').then(function(climateData) {

      // console.log(fireData)
      // console.log(climateData)

      // This is adding the snow and total rain together, but is turned off at the moment, as not sure it's right
      let totalPrecip = []
      for (let n = 0; n < climateData.length; n++) {
        totalPrecip.push(climateData[n].precip + climateData[n].snow);
      };

    //   function regress (x, y) {
    //     linearRegression = ss.linearRegression(ss.zip(x, y));
    //     return [linearRegression.m, linearRegression.b]
    //   }

      let traceRainVersusFireCount = [{ 
        x: fireData.map(item => item.count),
        y: climateData.map(item => item.precip),
        // y: totalPrecip,  Turned off until confirm is correct
        mode: 'markers', 
        type: 'scatter',
        // https://stackoverflow.com/questions/63591099/plotly-changing-the-hover-text
        text: climateData.map((item, index) => `Year: ${item._id}<br>Precipitation: ${item.precip.toLocaleString()} mm<br>Fires: ${fireData[index].count.toLocaleString()}`),
        hovertemplate: "%{text}",
        name: ''
      }];

    //   https://plotly.com/python/figure-labels/
      let layoutRainVersusFireCount = {
        title: {
            text: 'Precipitation vs. Number of Fires',
            font: {
                family: 'Arial, sans-serif',
                size: 20,
                color: 'dark gray'
            },
            y: 0.84
        },
        xaxis:{title: 'Number of Fires'},
        yaxis:{title: 'Total Fire Season Precipitation (mm)'},
        plot_bgcolor: '#f5f5f5', 
        paper_bgcolor: '#ffffff',
        font: {
            family: 'Arial, sans-serif',
            size: 14,
            color: 'dark gray'
        }
      }

      let traceTempVersusFireCount = [{ 
        x: fireData.map(item => item.count),
        y: climateData.map(item => item.mean_temp),
        mode: 'markers', 
        type: 'scatter',
        text: climateData.map((item, index) => `Year: ${item._id}<br>Temperature: ${item.mean_temp.toFixed(2)} °C<br>Fires: ${fireData[index].count.toLocaleString()}`),
        hovertemplate: "%{text}",
        name: ''
      }];

      let layoutTempVersusFireCount = {
        title: {
            text: 'Temperature vs. Number of Fires',
            font: {
                family: 'Arial, sans-serif',
                size: 20,
                color: 'dark gray'
            },
            y: 0.84
        },
        xaxis:{title: 'Number of Fires'},
        yaxis:{title: 'Mean Temperature (°C)'},
        plot_bgcolor: '#f5f5f5', 
        paper_bgcolor: '#ffffff',
        font: {
          family: 'Arial, sans-serif',
          size: 14,
          color: 'dark gray'
      }
      }

      let traceRainVersusFireSize = [{ 
        x: fireData.map(item => item.total_burn),
        y: climateData.map(item => item.precip),
        // y: totalPrecip,  Turned off until confirm is correct
        mode: 'markers', 
        type: 'scatter',
        text: climateData.map((item, index) => `Year: ${item._id}<br>Precipitation: ${item.precip.toLocaleString()} mm<br>Fire size: ${fireData[index].total_burn.toLocaleString()} ha`),
        hovertemplate: "%{text}",
        name: ''
      }];

      let layoutRainVersusFireSize = {
        title: {
            text: 'Precipitation vs. Size of Fires',
            font: {
                family: 'Arial, sans-serif',
                size: 20,
                color: 'dark gray'
            },
            y: 0.84
        },
        xaxis:{title: 'Size of Fires (ha)'},
        yaxis:{title: 'Total Fire Season Precipitation (mm)'},
        plot_bgcolor: '#f5f5f5', 
        paper_bgcolor: '#ffffff',
        font: {
          family: 'Arial, sans-serif',
          size: 14,
          color: 'dark gray'
      }
      }

      let traceTempVersusFireSize = [{ 
        x: fireData.map(item => item.total_burn),
        y: climateData.map(item => item.mean_temp),
        mode: 'markers', 
        type: 'scatter',
        text: climateData.map((item, index) => `Year: ${item._id}<br>Temperature: ${item.mean_temp.toFixed(2)} °C<br>Fire size: ${fireData[index].total_burn.toLocaleString()} ha`),
        hovertemplate: "%{text}",
        name: ''
      }];

      let layoutTempVersusFireSize = {
        title: {
            text: 'Temperature vs. Size of Fires',
            font: {
                family: 'Arial, sans-serif',
                size: 20,
                color: 'dark gray'
            },
            y: 0.84
        },
        xaxis:{title: 'Size of Fires (ha)'},
        yaxis:{title: 'Mean Temperature (°C)'},
        plot_bgcolor: '#f5f5f5', 
        paper_bgcolor: '#ffffff',
        font: {
          family: 'Arial, sans-serif',
          size: 14,
          color: 'dark gray'
      }
      }

      Plotly.newPlot('rain-vs-count', traceRainVersusFireCount, layoutRainVersusFireCount);
      Plotly.newPlot('temp-vs-count', traceTempVersusFireCount, layoutTempVersusFireCount);
      Plotly.newPlot('rain-vs-size', traceRainVersusFireSize, layoutRainVersusFireSize);
      Plotly.newPlot('temp-vs-size', traceTempVersusFireSize, layoutTempVersusFireSize);
    });
  });