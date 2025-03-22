import os
from flask import Flask, jsonify
from flask_cors import CORS
from llm_utils import generate_paper


app = Flask(__name__)

CORS(app)


# Route for testing the API
@app.route("/")
def hello():
    return jsonify({"message": "Hello, World!"})


@app.route("/generate-paper", methods=["GET"])
def get_question_paper():
    try:
        questions = generate_paper()
        return jsonify({"questions": questions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
