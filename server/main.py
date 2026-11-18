import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
import bcrypt

# טעינת משתני הסביבה מקובץ .env
load_dotenv()

# יצירת אפליקציית FastAPI
app = FastAPI()

# הרשאת הלקוח (React) לדבר עם השרת — CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# התחברות ל-Supabase
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)


# הגדרת מבנה הנתונים שמגיע מהלקוח
class UserCredentials(BaseModel):
    email: str
    password: str


# --- נקודת קצה: הרשמה ---
@app.post("/api/register")
def register(credentials: UserCredentials):
    email = credentials.email
    password = credentials.password

    # בדיקה אם המשתמש כבר קיים
    existing = supabase.table("users").select("id").eq("email", email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="המייל כבר רשום במערכת")

    # הצפנת הסיסמה לפני השמירה
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # שמירה בבסיס הנתונים
    supabase.table("users").insert({
        "email": email,
        "password_hash": password_hash
    }).execute()

    return {"message": "ההרשמה הושלמה בהצלחה!"}


# --- נקודת קצה: כניסה ---
@app.post("/api/login")
def login(credentials: UserCredentials):
    email = credentials.email
    password = credentials.password

    # חיפוש המשתמש בבסיס הנתונים
    result = supabase.table("users").select("*").eq("email", email).execute()

    if not result.data:
        raise HTTPException(status_code=401, detail="מייל או סיסמה שגויים")

    user = result.data[0]

    # אימות הסיסמה מול הגרסה המוצפנת
    password_matches = bcrypt.checkpw(
        password.encode("utf-8"),
        user["password_hash"].encode("utf-8")
    )

    if not password_matches:
        raise HTTPException(status_code=401, detail="מייל או סיסמה שגויים")

    return {"message": f"ברוך הבא, {email}!", "user_id": user["id"]}


# נקודת קצה לבדיקה שהשרת עובד
@app.get("/api/health")
def health_check():
    return {"status": "ok"}
