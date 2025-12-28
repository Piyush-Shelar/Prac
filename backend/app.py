from flask import Flask, request, jsonify
from flask_cors import CORS
import model 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/predict", methods=["POST","OPTIONS","GET"])
def predict():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.get_json()
    days = data.get("days")
    user = data.get("user")
    print(days)
    print(user)
   
    result=model.model(days,user)
    print(result)# dummy logic
    return ({"prediction": result})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
