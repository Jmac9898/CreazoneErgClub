# Frontend for Creazone Challenges

This folder contains the static site you can host on GitHub Pages. It communicates with the backend API to display challenges, submit scores and show leaderboards.

**Important**: edit `js/app.js` and replace `API_BASE` with the URL where the backend is hosted.

To test locally, you can serve the `frontend` directory using a simple web server, e.g.:

```bash
cd frontend
python -m http.server 8000
```

Then visit http://localhost:8000 in your browser. CORS settings on the backend must allow `http://localhost:8000` during development.
