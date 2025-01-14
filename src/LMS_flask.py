from flask import Flask, request, jsonify
from flask_cors import CORS
from rag import generate_response_with_gemini  # Import the RAG logic

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
<<<<<<< HEAD
=======
        # JSON 데이터 확인
>>>>>>> 5184ac33dd03b98510fb0c446c6b1e4ec040d9a6
        data = request.get_json()
        if not data or "question" not in data:
            return jsonify({"error": "Invalid request format. 'question' key is required."}), 400

<<<<<<< HEAD
        user_question = data["question"]

=======
        # 사용자 질문 가져오기
        user_question = data["question"]

        # 질문 처리
>>>>>>> 5184ac33dd03b98510fb0c446c6b1e4ec040d9a6
        answer = generate_response_with_gemini(user_question)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

