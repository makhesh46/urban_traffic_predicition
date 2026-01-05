import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Load dataset
data = pd.read_csv("traffic_data.csv")

# Encode weather
le = LabelEncoder()
data["weather"] = le.fit_transform(data["weather"])

# Features and target
X = data[["density", "speed", "weather"]]
y = data["congestion"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Accuracy
accuracy = model.score(X_test, y_test)
print("Model Accuracy:", accuracy)

# Prediction function
def predict_traffic(density, speed, weather):
    weather_encoded = le.transform([weather])
    prediction = model.predict([[density, speed, weather_encoded[0]]])
    return prediction[0]

# Example prediction
result = predict_traffic(120, 30, "Rainy")
print("Predicted Congestion Level:", result)
