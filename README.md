# SDLC_OPTIMIZATION_Grad (RepoMind)

## Requirements

- Python 3.10+
- Node.js 18+

## 1. Set up the environment file

In the project folder, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then open `.env` and fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY` (ask the team for the values).

## 2. Run the backend

```bash
python -m venv .venv
.venv\Scripts\activate            # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cd backend
uvicorn app.main:app --reload --port 8000
```

Leave this terminal open.

## 3. Run the frontend

In a new terminal, from the project folder:

```bash
cd frontend
npm install
npm run dev
```

## 4. Open the app

Go to http://localhost:3000
