import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// דף hello — מבקש מהשרת את /api/hello/{name} ומציג את התשובה
function Hello({ user, serverUrl, styles }) {
  const [hello, setHello] = useState(null);
  const [error, setError] = useState('');

  // רץ בכל פעם ש-user משתנה
  useEffect(() => {
    if (!user) return;
    fetch(`${serverUrl}/api/hello/${encodeURIComponent(user)}`)
      .then(res => res.json())
      .then(data => setHello(data))
      .catch(() => setError('לא ניתן להתחבר לשרת'));
  }, [user, serverUrl]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>👋 Hello</h1>

        {!user && <p style={{ textAlign: 'center' }}>צריך להתחבר קודם</p>}
        {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
        {hello && (
          <p style={{ textAlign: 'center' }}>
            {hello.message}, {hello.name}
          </p>
        )}

        <Link to="/" style={{ textAlign: 'center', color: '#4f46e5' }}>
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}

export default Hello;
