from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 🔥 VERY IMPORTANT

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    density = data.get("density", 0)
    speed = data.get("speed", 0)
    weather = data.get("weather", "Clear")

    # SIMPLE LOGIC (demo-friendly)
    if density > 120 or speed < 30 or weather == "Rainy":
        congestion = "High"
    elif density > 70:
        congestion = "Medium"
    else:
        congestion = "Low"

    return jsonify({
        "congestion": congestion
    })

if __name__ == "__main__":
    app.run(debug=True)
