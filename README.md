# Dashboard for Wildfire Detection and Climate Trends
**Overview**

This project consists of a "Wildfire and Climate Data Dashboard" that integrates front-end visualization, back-end logic, and database loading procedures.

**Usage**

User should load databases into their MongoDB using the following commands:

`mongoimport --type csv -d wildfires -c Clean_Climate_Data --headerline --drop climate-data-cleaned.csv`

`mongoimport --type csv -d wildfires -c Fire_Point --headerline --drop Fire_Disturbance_Point.csv`

Flask Caching is also used in the `app.py` file. This library can be installed by running `pip install flask_caching` from the user's appropriate conda environment.

Once prepared, user runs the command `python app.py` from their conda environment to launch the Flask application.

**Files and Structure**

`app.py`

A Flask web application that serves climate and wildfire data. It uses MongoDB as a database and includes caching and data aggregation functionalities.

`/templates/index.html`

The main HTML file defines the structure of the web page. It includes Bootstrap for styling, Leaflet for mapping, and custom CSS.

`Database_Load.ipynb`

A Jupyter Notebook that provides instructions and code for importing wildfire and climate data into MongoDB. It also includes data processing code for analyzing the data.

**Installation and Running Notes**
Requirements

* Python (Version 3.x recommended)
* Flask (install flask caching)
* pymongo
* MongoDB (local installation)
* Running the Application
* Follow the instructions in Database_Load.ipynb to import the required data into MongoDB.
* python app.py

**Contributing**

* Juan Moncaleano
* Sean Allen
* Justin Zhang

**Citations**

* https://www.mongodb.com/docs/v2.2/reference/operator/aggregation/project/

Ran into a barrier with pre-aggregation of data prior to pipeline query. $Project turned out to be the solution.

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString

This was a clutch resource when it came to make the 16.454643544356435643542335 temperatures palatable.

* https://stackoverflow.com/questions/63591099/plotly-changing-the-hover-text

This solved our hovertext issues, which took a while to work out. Removing the Trace string was the key.

* https://plotly.com/python/figure-labels/

Went deep in the rabbit hole to fine-tune the Plotly layouts.

**Data Sources**

Fire Disturbance Point Dataset -- Ontario GeoHub

https://geohub.lio.gov.on.ca/datasets/lio::fire-disturbance-point/about

Climate Datasets -- Government of Canada

https://climate-change.canada.ca/climate-data/#/monthly-climate-summaries

