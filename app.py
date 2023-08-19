from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_caching import Cache

app = Flask(__name__)

# Configure caching
cache = Cache(app, config={"CACHE_TYPE": "simple"})

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["wildfires"]

# Connect to the collections
collection1 = db["Fire_Point"]
collection2 = db["Clean_Climate_Data"]


# Function to query data based on the year
def get_climate_by_specific_year(collection, year):
    try:
        query = {"LOCAL_YEAR": year}
        data = list(collection.find(query, {"_id": 0}))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Function to query data based on the year
def get_fire_by_specific_year(collection, year):
    try:
        query = {"FIRE_YEAR": year}
        data = list(collection.find(query, {"_id": 0}))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Define routes with caching
@cache.cached(timeout=300)
@app.route("/")
def welcome():
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/fires/{{year}}<br/>"
        f"/api/v1.0/climate/{{year}}<br/>"
    )


@cache.cached(timeout=300)
@app.route("/api/v1.0/fires/<int:year>")
def get_fires_by_year(year):
    return get_fire_by_specific_year(collection1, year)


@cache.cached(timeout=300)
@app.route("/api/v1.0/climate/<int:year>")
def get_climate_by_year(year):
    return get_climate_by_specific_year(collection2, year)


if __name__ == "__main__":
    app.run(debug=True)