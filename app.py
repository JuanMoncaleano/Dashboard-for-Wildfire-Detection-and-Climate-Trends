from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["your_database"]  # Replace with our database name

# Connect to the three different collections
collection1 = db["collection1"]
collection2 = db["collection2"]
collection3 = db["collection3"]


# Define a function to query data based on the year range
def get_data_by_year(collection):
    start_year = request.args.get("start_year", default=1975, type=int)
    end_year = request.args.get("end_year", default=2020, type=int)
    data = list(
        collection.find({"year": {"$gte": start_year, "$lte": end_year}}, {"_id": 0})
    )
    return jsonify(data)


# Define routes to get data from the collections based on the year range
@app.route("/api/data1", methods=["GET"])
def get_data1():
    return get_data_by_year(collection1)


@app.route("/api/data2", methods=["GET"])
def get_data2():
    return get_data_by_year(collection2)


@app.route("/api/data3", methods=["GET"])
def get_data3():
    return get_data_by_year(collection3)


if __name__ == "__main__":
    app.run(debug=True)
