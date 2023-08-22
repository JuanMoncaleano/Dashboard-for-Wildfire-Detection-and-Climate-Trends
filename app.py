
from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from flask_caching import Cache

app = Flask(__name__)

# Configure caching
cache = Cache(app, config={"CACHE_TYPE": "simple"})

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["wildfires"]

# Connect to the collections
firePoints = db["Fire_Point"]
weatherStations = db["Clean_Climate_Data"]

# Climate Data by year (groups by the weather station and returns aggregate data)
# f"/api/v1.0/climate/{{year}}<br/>"
def get_climate_by_specific_year(collection, year):
    try:
        # query = {"LOCAL_YEAR": year}
        # data = list(collection.find(query, {"_id": 0}))
        pipeline = [
        {
            "$match": {
              "LOCAL_YEAR": year
            }
        },
        {
            "$group": {
                "_id": "$STATION_NAME",
                "lat": {"$first": "$LATITUDE"},
                "lon": {"$first": "$LONGITUDE"},
                "precip": {"$sum": '$TOTAL_PRECIPITATION'},
                "snow": {"$sum": '$TOTAL_SNOWFALL'},
                "mean_temp": {"$avg": "$MEAN_TEMPERATURE"}
            }
        },
        {
            "$sort": {
                '_id': 1
            }
        }
        ]
        data = list(collection.aggregate(pipeline))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Fire data points by year
# f"/api/v1.0/fires/{{year}}<br/>"
def get_fire_by_specific_year(collection, year):
    try:
        query = {"FIRE_YEAR": year}
        sort_order = [("FIRE_START_DATE")]
        data = list(collection.find(query, {"_id": 0}).sort(sort_order))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Climate Data grouped by year (groups on the year and returns aggregate data for all weather stations)
def grouped_climate_by_year(collection, start, end):
    try:
        pipeline = [
        {
            "$match": {
              "LOCAL_YEAR": {"$gte": start, "$lte": end}
            }
        },
        {
            "$group": {
                "_id": "$LOCAL_YEAR",
                "precip": {"$sum": '$TOTAL_PRECIPITATION'},
                # "snow": {"$sum": '$TOTAL_SNOWFALL'},
                "mean_temp": {"$avg": "$MEAN_TEMPERATURE"}
            }
        },
        {
            "$sort": {
                '_id': 1
            }
        }
        ]
        data = list(collection.aggregate(pipeline))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Climate Data grouped by only fire seasons (groups on the season and returns aggregate data for all weather stations)
def grouped_climate_by_season(collection, start, end):
    try:
        pipeline = [
        {
            "$match": {
              "LOCAL_YEAR": {"$gte": start, "$lte": end},
              "LOCAL_MONTH": {"$gte": 5, "$lte": 9}
            }
        },
        {
            "$group": {
                "_id": "$LOCAL_YEAR",
                "precip": {"$sum": '$TOTAL_PRECIPITATION'},
                # "snow": {"$sum": '$TOTAL_SNOWFALL'},
                "mean_temp": {"$avg": "$MEAN_TEMPERATURE"}
            }
        },
        {
            "$sort": {
                '_id': 1
            }
        }
        ]
        data = list(collection.aggregate(pipeline))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
# Fire data grouped by year (groups by the year and returns count and burn size)
# f"/api/v1.0/fires/{{start}}/{{end}}<br/>"
def grouped_fire_by_year(collection, start, end):
    try:
        pipeline = [
        {
            "$match": {
                "FIRE_YEAR": {"$gte": start, "$lte": end}
            }
        },
        {
            "$group": {
                "_id": "$FIRE_YEAR",
                "count": {"$sum": 1},
                "total_burn": {"$sum": "$FIRE_FINAL_SIZE"}
            }
        },
        {
            "$sort": {
                '_id': 1
            }
        }
        ]
        data = list(collection.aggregate(pipeline))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Fire data grouped by only the fire season (groups by the year and returns count and burn size)
# f"/api/v1.0/fires/season/{{start}}/{{end}}<br/>"
# https://www.mongodb.com/docs/v2.2/reference/operator/aggregation/project/
def grouped_fire_by_season(collection, start, end):
    try:
        pipeline = [
        {
            "$project": {
                "FIRE_YEAR": 1,
                "parsed_date": {
                    "$dateFromString": {
                        "dateString": { "$substr": ["$FIRE_START_DATE", 0, 10] },
                        "format": "%Y/%m/%d"
                    }
                },
                "FIRE_FINAL_SIZE": 1
            }
        },
        {
            "$project": {
                "FIRE_YEAR": 1,
                "parsed_month": { "$month": "$parsed_date" },
                "FIRE_FINAL_SIZE": 1
            }
        },        
        {
            "$match": {
                "FIRE_YEAR": {"$gte": start, "$lte": end},
                "parsed_month": {"$gte": 5, "$lte": 9}
            }
        },
        {
            "$group": {
                "_id": "$FIRE_YEAR",
                "count": {"$sum": 1},
                "total_burn": {"$sum": "$FIRE_FINAL_SIZE"}
            }
        },
        {
            "$sort": {
                '_id': 1
            }
        }
        ]
        data = list(collection.aggregate(pipeline))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Climate Data all (currently not used)
def get_climate_all(collection):
    try:
        query = {"LOCAL_YEAR": {"$gte": 0}}
        data = list(collection.find(query, {"_id": 0}))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Fire data all (currently not used)
def get_fires_all(collection):
    try:
        query = {"FIRE_YEAR": {"$gte": 0}}
        data = list(collection.find(query, {"_id": 0}))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Climate Data by month (currently not used)
def get_climate_by_specific_month(collection, start, end):
    try:
        pipeline = [
        {
            "$match": {
              "LOCAL_YEAR": {"$gte": start, "$lte": end},
              "LOCAL_MONTH": {"$gte": 5, "$lte": 9}
            }
        },
        {
            "$group": {
                "_id": "$LOCAL_YEAR",
                "precip": {"$sum": '$TOTAL_PRECIPITATION'},
                "snow": {"$sum": '$TOTAL_SNOWFALL'},
                "mean_temp": {"$avg": "$MEAN_TEMPERATURE"}
            }
        },
        {
            "$sort": {
                '_id': 1
            }
        }
        ]
        data = list(collection.aggregate(pipeline))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Fire data grouped by month (currently not used)
def get_fire_by_specific_month(collection, start, end):
    try:
        pipeline = [
    {
        "$match": {
             "FIRE_YEAR": {"$gte": start, "$lte": end}
        }
    },
    {
        "$group": {
            "_id": { "$month": { "$dateFromString": { "dateString": { "$substr": [ "$FIRE_START_DATE", 0, 10] }, "format": "%Y/%m/%d" } } },
            "count": {"$sum": 1},
            "total_burn": {"$sum": "$FIRE_FINAL_SIZE"}
         }
     },
    {
        "$sort": {
             '_id': 1
        }
     }
    ]
        data = list(collection.aggregate(pipeline))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

      
# Define routes with caching
@cache.cached(timeout=300)
@app.route("/dev")
def welcome():
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/fires/{{year}}<br/>"
        f"/api/v1.0/climate/{{year}}<br/>"
        f"/api/v1.0/fires/{{start}}/{{end}}<br/>"
        f"/api/v1.0/climate/{{start}}/{{end}}<br/>"
        f"/api/v1.0/fires/all<br/>"
        f"/api/v1.0/climate/all<br/>"
        f"/api/v1.0/fires/{{month}}<br/>"
        f"/api/v1.0/climate/month/{{start}}/{{end}}<br/>"
        f"/api/v1.0/fires/season/{{start}}/{{end}}<br/>"
        f"/api/v1.0/climate/season/{{start}}/{{end}}<br/>"
    )

@cache.cached(timeout=300)
@app.route("/api/v1.0/fires/<int:year>")
def get_fires_by_year(year):
    return get_fire_by_specific_year(firePoints, year)

@cache.cached(timeout=300)
@app.route("/api/v1.0/climate/<int:year>")
def get_climate_by_year(year):
    return get_climate_by_specific_year(weatherStations, year)

@cache.cached(timeout=300)
@app.route("/api/v1.0/fires/<int:start>/<int:end>")
def get_fires_by_grouped_years(start, end):
    return grouped_fire_by_year(firePoints, start, end)

@cache.cached(timeout=300)
@app.route("/api/v1.0/climate/<int:start>/<int:end>")
def get_climate_by_grouped_years(start, end):
    return grouped_climate_by_year(weatherStations, start, end)

@cache.cached(timeout=300)
@app.route("/api/v1.0/fires/all")
def get_fires():
    return get_fires_all(firePoints)

@cache.cached(timeout=300)
@app.route("/api/v1.0/climate/month")
def get_climate():
    return get_climate_all(weatherStations)

@cache.cached(timeout=300)
@app.route("/api/v1.0/fires/month/<int:start>/<int:end>")
def get_fires_by_month(start, end):
    return get_fire_by_specific_month(firePoints, start, end)

@cache.cached(timeout=300)
@app.route("/api/v1.0/climate/month/<int:start>/<int:end>")
def get_climate_by_month(start, end):
    return get_climate_by_specific_month(weatherStations, start, end)

@cache.cached(timeout=300)
@app.route("/api/v1.0/fires/season/<int:start>/<int:end>")
def get_fires_by_grouped_seasons(start, end):
    return grouped_fire_by_season(firePoints, start, end)

@cache.cached(timeout=300)
@app.route("/api/v1.0/climate/season/<int:start>/<int:end>")
def get_climate_by_grouped_seasons(start, end):
    return grouped_climate_by_season(weatherStations, start, end)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)