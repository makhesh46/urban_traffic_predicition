import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

data = pd.read_csv("traffic_data.csv")

le = LabelEncoder()
data["weather"] = le.fit_transform(data["weather"])

X = data[["density", "speed", "weather"]]
y = data["congestion"]

model = RandomForestClassifier(n_estimators=50, random_state=1)
model.fit(X, y)

def predict_traffic(density, speed, weather):
    w = le.transform([weather])[0]
    return model.predict([[density, speed, w]])[0]
