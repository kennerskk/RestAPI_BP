# Express Mongo REST API (Stats)

Simple backend that exposes REST endpoints to insert/update/read/delete `stat` documents in MongoDB.

## Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and optionally `PORT`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development (with auto-reload using nodemon):
   ```bash
   npm run dev
   ```
   Or run normally:
   ```bash
   npm start
   ```

## API Routes

- `POST /api/stat`  
  Body JSON: `{ "timestamp": "...", "value": 123, ... }`  
  If a document with the same `timestamp` exists, it will be replaced/updated; otherwise inserted.

- `GET /api/stat`  
  Returns all stat documents.

- `GET /api/stat/:timestamp`  
  Returns the document with the given timestamp.

- `DELETE /api/stat/:timestamp`  
  Deletes the document with the given timestamp.

## Example curl
Insert/update:
```bash
curl -X POST http://localhost:3000/api/stat \
  -H "Content-Type: application/json" \
  -d '{"timestamp":"2025-11-11T12:00:00Z","value":42}'
```

Fetch all:
```bash
curl http://localhost:3000/api/stat
```
