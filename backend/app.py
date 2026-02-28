import os
from flask import Flask, jsonify, request
from flask_cors import CORS

# firebase admin for database/auth
import firebase_admin
from firebase_admin import credentials, firestore

# load .env file if present
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

# initialize firebase if credentials are provided
if not firebase_admin._apps:
    cred_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

# firestore client (will raise if not initialized)
try:
    db = firestore.client()
except Exception:
    db = None

# simple helper to verify an ID token (from Firebase Authentication)
def verify_id_token(token):
    """Return decoded token or None if invalid."""
    if not token or db is None:
        return None
    try:
        decoded = firebase_admin.auth.verify_id_token(token)
        return decoded
    except Exception:
        return None


@app.route('/api/challenges', methods=['GET'])
def get_challenges():
    """Return list of workout challenges from Firestore."""
    if db is None:
        return jsonify([])
    challenges = []
    docs = db.collection('challenges').stream()
    for doc in docs:
        d = doc.to_dict()
        d['id'] = doc.id
        challenges.append(d)
    return jsonify(challenges)

@app.route('/api/scores', methods=['POST'])
def post_score():
    """Receive a score submission and store it."""
    data = request.json
    if not data:
        return jsonify({'error': 'no data'}), 400
    if db is None:
        return jsonify({'error': 'database not configured'}), 500
    db.collection('scores').add(data)
    return jsonify({'status': 'ok'}), 201

@app.route('/api/leaderboard/<challenge_id>', methods=['GET'])
def get_leaderboard(challenge_id):
    """Return top scores for a given challenge."""
    if db is None:
        return jsonify([])
    scores_ref = (db.collection('scores')
                    .where('challenge_id', '==', challenge_id)
                    .order_by('score', direction=firestore.Query.DESCENDING)
                    .limit(10))
    scores = []
    for doc in scores_ref.stream():
        s = doc.to_dict()
        scores.append(s)
    return jsonify(scores)

if __name__ == '__main__':
    # development server
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
