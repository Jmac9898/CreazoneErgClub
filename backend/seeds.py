"""Utility script to populate Firestore with sample challenges.

Usage:

    export GOOGLE_APPLICATION_CREDENTIALS=/path/to/creds.json
    python seeds.py

"""
import os
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    if not cred_path:
        raise RuntimeError('set GOOGLE_APPLICATION_CREDENTIALS before running')
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

sample = [
    {'name': '1km Row'},
    {'name': '500m Sprint'},
    {'name': 'Max Deadlift'},
]

for ch in sample:
    db.collection('challenges').add(ch)
    print('added', ch)
