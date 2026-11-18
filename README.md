# my-auth-app

## לפני ההרצה — חובה!

פתחו את קובץ `.env` ומלאו:
1. `SUPABASE_URL` — מ-Supabase Settings → API → Project URL
2. `SUPABASE_KEY` — מ-Supabase Settings → API → anon public key

וודאו שיצרתם את טבלת `users` ב-Supabase SQL Editor:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## הרצה

```bash
docker compose up --build
```

- לקוח: http://localhost:3000
- שרת: http://localhost:8000
- תיעוד API: http://localhost:8000/docs

## עצירה

```bash
docker compose down
```
