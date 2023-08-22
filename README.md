# Dashboard for Wildfire Detection and Climate Trends
**Overview**

This project consists of a "Wildfire and Climate Data Dashboard" that integrates front-end visualization, back-end logic, and database loading procedures.

**Files and Structure**

index.html
The main HTML file defines the structure of the web page. It includes Bootstrap for styling, Leaflet for mapping, and custom CSS.

app.py

A Flask web application that serves climate and wildfire data. It uses MongoDB as a database and includes caching and data aggregation functionalities.

Database_Load.ipynb

A Jupyter Notebook that provides instructions and code for importing wildfire and climate data into MongoDB. It also includes data processing code for analyzing the data.

**Installation and Running**
Requirements

* Python (Version 3.x recommended)
* Flask
* pymongo
* MongoDB (local installation)
* Running the Application
* Follow the instructions in Database_Load.ipynb to import the required data into MongoDB.
* python app.py
* Open index.html in a web browser.

**Contributing**

* Juan Moncaleano
* Sean Allen
* Justin Zhang
