# CreazoneErgClub

Erg Club project containing a **static frontend** for workout challenges and a **Python backend** that communicates with Google Firebase for data storage and authentication. The frontend is designed for GitHub Pages deployment. The styling takes inspiration from the Creazone website (https://www.creazione.co.uk/) using a white/orange/black palette.

---

## Repository Structure

```
frontend/         # static assets served on GitHub Pages
  index.html
  css/style.css
  js/app.js
backend/          # Python API server
  app.py
  requirements.txt
  .env.example
.gitignore
README.md
```

## Frontend

1. The static files live under `frontend/` and are safe to host on GitHub Pages (`username.github.io/repo`).
2. `index.html` renders a list of challenges, a score submission form, and a leaderboard area.
3. `css/style.css` carries the main site styles using the Creazone colour scheme (`#ff6600` accent, dark text on light background).
4. `js/app.js` handles fetching challenge/leaderboard data and posting scores to the backend API. **You must update** the `API_BASE` constant with your deployed backend URL before publishing.

### Deploying Frontend

- Push the `frontend/` content to a branch named `gh-pages` or configure GitHub Pages to serve from `main`/`docs`—see GitHub Pages documentation.
- Ensure CORS is enabled on the backend to allow requests from pages served on `github.io`.

## Backend

The Python service uses Flask and Firebase Admin SDK to expose a simple REST API:

- `GET /api/challenges` – list challenge documents from Firestore
- `POST /api/scores` – submit a score (expects JSON `{username,challenge_id,score}`) **(you can require a Firebase ID token by verifying it with `verify_id_token` helper)**
- `GET /api/leaderboard/<challenge_id>` – top 10 scores for a challenge, ordered descending

### Setup

1. Install Python dependencies:
   ```bash
   cd backend
   python -m venv venv            # optional but recommended
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Obtain a Firebase service account JSON file and set `GOOGLE_APPLICATION_CREDENTIALS` to its path (see `.env.example`).
3. Run the server:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/creds.json"
   python app.py
   ```
4. The app listens on port 5000 by default. Deploy it to a platform of your choice (Heroku, Cloud Run, etc.) and keep the `PORT` environment variable if required.

> **Note:** Make sure the Firestore database has two collections: `challenges` (documents with at least a `name` field) and `scores`.

## Firebase

A small helper (`backend/seeds.py`) is included to populate Firestore with a few example challenges. Run it after you set your credentials:

```bash
cd backend
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/creds.json"
python seeds.py
```

### Authentication

The frontend includes a login page (`frontend/login.html`) which uses Firebase
Authentication (email/password) to sign users in. To enable it:

1. Create a Firebase project and enable **Email/Password** sign-in method.
2. Copy the project's configuration object and paste it into `frontend/js/app.js`
   and `frontend/login.html` (replace the `firebaseConfig` placeholders).
3. When a user logs in, the nav link changes to `Logout (email)`; clicking it
   signs the user out.

> Note: the backend is currently not enforcing authentication on requests. You
> may want to extend the API to verify the ID token (use `verify_id_token` in
> `backend/app.py`) before accepting score submissions.


1. Enable Firestore in your Firebase project.
2. Optionally, set up Firebase Authentication and configure the backend to verify tokens in requests (not implemented yet).
3. Provide the service account file privately; do not commit it to this repo.

## Styling and Branding

The look-and-feel roughly mirrors Creazone's public site: an orange header, white background, black/dark grey text, and clean, responsive sections. Feel free to refine CSS further.

---

For development or questions, open an issue in this repository or contact the maintainer.
