# תבנית בסיס לפרויקט הנדסת תוכנה

**React · FastAPI · Supabase · Docker**

תבנית בסיס לבניית מערכת Web מלאה (Full-Stack): לקוח, שרת ובסיס נתונים בענן, שרצים יחד ב-Docker Compose.
התבנית מגיעה עם דוגמה עובדת של הרשמה וכניסה, כנקודת התחלה להרחבת הפרויקט.

הדוגמה הקיימת מאפשרת:
- הרשמה עם כתובת מייל וסיסמה
- כניסה עם אותם פרטים
- שמירת הנתונים בבסיס נתונים בענן

## הטכנולוגיות

| שכבה | טכנולוגיה | תפקיד |
|------|-----------|-------|
| לקוח (Frontend) | React | ספריית JavaScript לבניית ממשקי משתמש |
| שרת (Backend) | Python + FastAPI | לוגיקה עסקית ופנייה לבסיס הנתונים |
| בסיס נתונים | Supabase | שירות ענן מבוסס PostgreSQL |
| סביבת עבודה | Docker Compose | אריזת השירותים והרצתם יחד |

> **דרישה מוקדמת:** יש להתקין [Docker Desktop](https://www.docker.com/products/docker-desktop/).

---

## ארכיטקטורה

```
┌─────────────────────────────────────────────┐
│  BROWSER — לקוח React (PORT 3000)            │
│     דף הרשמה            דף כניסה               │
└──────────────────┬──────────────────────────┘
                   │  HTTP REST API (JSON)
                   ▼
┌─────────────────────────────────────────────┐
│  SERVER — FastAPI Python (PORT 8000)        │
│     POST /api/register    POST /api/login   │
└──────────────────┬──────────────────────────┘
                   │  Supabase Python Client (HTTPS)
                   ▼
┌─────────────────────────────────────────────┐
│  DATABASE — Supabase (ענן)                   │
│     טבלת users: id, email, password_hash     │
└─────────────────────────────────────────────┘
```

- **לקוח (React)** — הדפדפן מציג ממשק גרפי ש-React בונה באופן דינמי. שכבה זו אחראית רק על מה שהמשתמש רואה ועל שליחת בקשות לשרת.
- **שרת (FastAPI)** — שכבת הלוגיקה העסקית. מקבל בקשות מהלקוח, מבצע בדיקות (האם המייל כבר קיים? האם הסיסמה נכונה?) ומדבר עם בסיס הנתונים.
- **בסיס נתונים (Supabase)** — שומר את המשתמשים בענן.

### תקשורת — REST API

הלקוח והשרת מדברים דרך בקשות HTTP בפורמט JSON:

| Endpoint | Method | תיאור |
|----------|--------|-------|
| `/api/register` | POST | הרשמת משתמש חדש |
| `/api/login` | POST | כניסה למשתמש קיים |
| `/api/health` | GET | בדיקה שהשרת עובד |

---

## מבנה הפרויקט

```
├── .env.example          # תבנית למשתני הסביבה
├── docker-compose.yml    # הגדרת שני השירותים והרצתם יחד
├── server/
│   ├── Dockerfile
│   ├── requirements.txt  # ספריות Python
│   └── main.py           # קוד השרת
└── client/
    ├── Dockerfile
    ├── package.json      # ספריות JavaScript
    ├── public/index.html
    └── src/
        ├── index.js      # נקודת הכניסה של React
        └── App.js        # קוד הלקוח — מסכי כניסה/הרשמה
```

---

## שלב 1 — הרשמה ל-Supabase

Supabase הוא שירות BaaS (Backend as a Service) — בסיס נתונים בענן עם ממשק ניהול נוח, שמאפשר לשמור ולשלוף נתונים בלי להתקין שרת בסיס נתונים בעצמנו. הוא מבוסס על PostgreSQL ומספק שכבת אבטחה מובנית.

1. גשו ל-https://supabase.com ולחצו **Start your project**.
2. הירשמו עם חשבון GitHub (מומלץ) או עם מייל.
3. לחצו **New project**.
4. בחרו שם משמעותי לפרויקט, הגדירו סיסמה לבסיס הנתונים (**שמרו אותה!**) ובחרו אזור קרוב (Region — למשל `eu-central-1`).
5. לחצו **Create new project** והמתינו כחצי דקה.
6. ב-**Project overview**, בתפריט הנפתח שליד המילה **copy**, תמצאו את ה-**Project URL**.
7. תחת **Project Settings → API Keys** לחצו על **view legacy API keys**. ליד המפתח **service_role** לחצו **Reveal** כדי לחשוף אותו, ואז העתיקו אותו (מתחיל ב-`ey…`).
   > ⚠️ זהו מפתח סודי שעוקף את הגבלות האבטחה של הטבלאות. הוא נשמר רק בקובץ `.env` של השרת, ולעולם לא בקוד הלקוח או ב-GitHub.

את שני הערכים מסעיפים 6 ו-7 נצטרך לקובץ `.env`.

## שלב 2 — יצירת טבלת users

1. בפרויקט Supabase לחצו על **SQL Editor** בתפריט השמאלי.
2. לחצו **New query**.
3. הדביקו את ה-SQL הבא ולחצו **Run**:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

4. אם מופיע חלון אזהרה על Row Level Security, בחרו **Run and enable RLS**, כדי שרק השרת שלנו (עם מפתח ה-service_role) יוכל לגשת לטבלה.

הסבר השדות:
- `id` — מספר מזהה ייחודי שגדל אוטומטית (כמו index במערך)
- `email` — כתובת המייל, חייבת להיות ייחודית
- `password_hash` — הסיסמה מוצפנת (לא שומרים סיסמאות גלויות!)
- `created_at` — תאריך ושעת ההרשמה, מתמלא אוטומטית

## שלב 3 — קובץ `.env`

קובץ `.env` מאחסן מידע רגיש (מפתחות, סיסמאות) מחוץ לקוד, כך שלא מעלים אותו ל-GitHub בטעות (הוא מופיע ב-`.gitignore`).

העתיקו את `.env.example` לקובץ חדש בשם `.env` בתיקייה הראשית:

```powershell
copy .env.example .env
```

ומלאו בו את הערכים משלב 1:

```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_KEY=YOUR_SERVICE_ROLE_KEY
```

## שלב 4 — הרצה ובדיקה

### בדיקה לפני ההרצה

ודאו שקובץ `.env` קיים בתיקייה הראשית (ליד `docker-compose.yml`) ושמילאתם בו את שני הערכים מ-Supabase. שאר הקבצים כבר נמצאים ב-repo (ראו [מבנה הפרויקט](#מבנה-הפרויקט)).

### בנייה והרצה

פתחו טרמינל בתיקייה הראשית של הפרויקט והריצו:

```bash
docker compose up --build
```

ההרצה הראשונה לוקחת 3–5 דקות, כי Docker מוריד images ומתקין תלויות. יופיע הרבה פלט, וזה תקין. חפשו שורות כמו:

```
server-1  | INFO:     Uvicorn running on http://0.0.0.0:8000
client-1  | Compiled successfully!
client-1  | You can now view auth-client in the browser.
```

### בדיקה בדפדפן

1. גשו ל-http://localhost:3000 — יוצג מסך הכניסה / הרשמה.
2. עברו להרשמה ונסו להירשם עם מייל וסיסמה.
3. ב-Supabase, ב-**Table Editor → users**, ודאו שהמשתמש נשמר (עם סיסמה מוצפנת בעמודה `password_hash`).
4. חזרו למסך הכניסה והיכנסו עם אותם פרטים.

### בדיקת השרת ישירות

- http://localhost:8000/api/health — אמור להחזיר `{"status": "ok"}`
- http://localhost:8000/docs — ממשק אינטראקטיבי של FastAPI (Swagger) לבדיקת ה-API

### עצירה

```bash
docker compose down
```

### שגיאות נפוצות

| שגיאה | סיבה אפשרית | פתרון |
|-------|-------------|-------|
| `לא ניתן להתחבר לשרת` / connection refused | השרת לא עלה | בדקו את לוגי השרת בטרמינל |
| invalid API key | `SUPABASE_KEY` שגוי בקובץ `.env` | העתיקו שוב את מפתח ה-service_role (שלב 1, סעיף 7) |
| `new row violates row-level security policy` (קוד `42501`) | בקובץ `.env` מוגדר ה-anon key במקום ה-service_role | החליפו למפתח ה-service_role (שלב 1, סעיף 7) |
| port already in use | פורט 3000 או 8000 תפוס | סגרו תוכנית אחרת שמשתמשת בפורט |
| table does not exist | טבלת `users` לא נוצרה | הריצו שוב את ה-SQL מ[שלב 2](#שלב-2--יצירת-טבלת-users) |

---

## הסבר על הקוד

### שרת — `server/main.py`

- **`@app.post("/api/register")`** — decorator שמגדיר שהפונקציה תרוץ כשמגיעה בקשת POST לנתיב הזה (בדומה ל-function pointer ב-C++).
- **הרשמה** — בודקת אם המייל כבר קיים בטבלה; אם לא, מצפינה את הסיסמה ושומרת את המשתמש.
- **כניסה** — מחפשת את המשתמש לפי מייל ומשווה את הסיסמה שהתקבלה לגרסה המוצפנת.
- **`bcrypt`** — ספרייה להצפנת סיסמאות. לעולם לא שומרים סיסמאות כטקסט גלוי!
- **CORS** — מאפשר לדפדפן (בכתובת `localhost:3000`) לתקשר עם שרת בכתובת אחרת (`localhost:8000`).
- **`HTTPException`** — שגיאה שמוחזרת ללקוח עם קוד HTTP (400 = שגיאת לקוח, 401 = לא מורשה).
- **`load_dotenv()` / `os.getenv(...)`** — קריאת `SUPABASE_URL` ו-`SUPABASE_KEY` ממשתני הסביבה.

ספריות Python מוגדרות ב-`server/requirements.txt`: `fastapi`, `uvicorn` (שרת ההרצה), `supabase`, `python-dotenv`, `bcrypt`.

### לקוח — `client/src/App.js`

- **`useState`** — פונקציה של React לניהול משתנים דינמיים. כשהערך משתנה, הדף מתרענן אוטומטית.
- **`fetch(...)`** — שליחת בקשת HTTP לשרת (בדומה ל-`curl` בשורת הפקודה).
- **`async/await`** — תחביר לטיפול בפעולות שלוקחות זמן (כמו המתנה לתשובת השרת).
- **`onClick`, `onChange`** — מטפלי אירועים (event handlers), בדומה ל-callback functions ב-C++.
- המשתנה `mode` קובע אם מוצג מסך כניסה או הרשמה; לאחר כניסה מוצלחת מוצג מסך "ברוך הבא".

### Docker Compose — `docker-compose.yml`

מאפשר להריץ את השרת ואת הלקוח בפקודה אחת.

- **`build: ./server`** — בניית image מה-Dockerfile שבתיקיית `server`.
- **`ports: "8000:8000"`** — מיפוי פורט 8000 במחשב שלנו לפורט 8000 בתוך הקונטיינר.
- **`env_file: .env`** — העברת כל משתני הסביבה מקובץ `.env` לתוך הקונטיינר.
- **`volumes`** — סנכרון קבצים בין המחשב לקונטיינר, כך ששינויי קוד מתעדכנים מיד בלי לבנות מחדש.
