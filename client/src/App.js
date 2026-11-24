import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Hello from './Hello';

// כתובת השרת — React מדבר עם השרת דרך כתובת זו
const SERVER_URL = 'http://localhost:8000';

function App() {
  // משתני state — כמו משתנים גלובליים שגורמים לדף להתרענן כשמשתנים
  const [mode, setMode] = useState('login');      // 'login' או 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // פונקציה לשליחת בקשה לשרת
  const handleSubmit = async () => {
    if (!email || !password) {
      setMessage('נא למלא מייל וסיסמה');
      setIsError(true);
      return;
    }

    const endpoint = mode === 'login' ? '/api/login' : '/api/register';

    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsError(false);
        if (mode === 'login') {
          setLoggedInUser(email);
        }
      } else {
        setMessage(data.detail || 'אירעה שגיאה');
        setIsError(true);
      }
    } catch (err) {
      setMessage('לא ניתן להתחבר לשרת');
      setIsError(true);
    }
  };

  // מסך ברוך הבא — למשתמש מחובר
  const welcomePage = (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✅ ברוך הבא!</h1>
        <p style={{ textAlign: 'center', color: '#555' }}>{loggedInUser}</p>
        <Link to="/hello" style={{ textAlign: 'center', color: '#4f46e5' }}>
          לדף hello
        </Link>
        <button
          style={styles.button}
          onClick={() => { setLoggedInUser(null); setEmail(''); setPassword(''); setMessage(''); }}
        >
          התנתק
        </button>
      </div>
    </div>
  );

  // מסך כניסה / הרשמה
  const loginPage = (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {mode === 'login' ? '🔐 כניסה' : '📝 הרשמה'}
        </h1>

        <input
          style={styles.input}
          type="email"
          placeholder="כתובת מייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleSubmit}>
          {mode === 'login' ? 'כניסה' : 'הרשמה'}
        </button>

        {message && (
          <p style={{ color: isError ? 'red' : 'green', textAlign: 'center', marginTop: 12 }}>
            {message}
          </p>
        )}

        <p style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
          {mode === 'login' ? 'אין לך חשבון? ' : 'כבר רשום? '}
          <span
            style={{ color: '#4f46e5', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(''); }}
          >
            {mode === 'login' ? 'הירשם כאן' : 'כנס כאן'}
          </span>
        </p>
      </div>
    </div>
  );

  // הדפים של האפליקציה — כל כתובת מציגה רכיב אחר
  return (
    <Routes>
      <Route path="/" element={loggedInUser ? welcomePage : loginPage} />
      <Route
        path="/hello"
        element={<Hello user={loggedInUser} serverUrl={SERVER_URL} styles={styles} />}
      />
    </Routes>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
    direction: 'rtl'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  title: {
    textAlign: 'center',
    color: '#1a1a2e',
    marginBottom: '8px'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    textAlign: 'right'
  },
  button: {
    padding: '12px',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '4px'
  }
};

export default App;
