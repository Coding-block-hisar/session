const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const port = 3000;

// Middleware to parse incoming requests (necessary for handling POST data)
app.use(express.urlencoded({ extended: true }));

// Setting up express-session middleware
app.use(session({
  secret: 'your-secret-key',  // Used to sign the session ID cookie
  resave: false,              // Don't save session if not modified
  saveUninitialized: true,    // Save uninitialized sessions
  cookie: {                   // Cookie options
    secure: false,            // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60    // Set session expiration time (1 hour)
  }
}));

// Route to show the form and session info
app.get('/', (req, res) => {
  res.sendFile(__dirname+'/login.html');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username } = req.body;

  // Save username to session
  req.session.username = username;

  res.send(`
    <h1>Welcome, ${username}!</h1>
    <p>You are logged in and your session data is saved.</p>
    <a href="/profile">Go to Profile</a>
  `);
});

// Route to show the profile page (only if logged in)
app.get('/profile', (req, res) => {
  if (req.session.username) {
    res.send(`
      <h1>Profile</h1>
      <p>Welcome to your profile, ${req.session.username}!</p>
      <a href="/logout">Logout</a>
    `);
  } else {
    res.redirect('/');
  }
});

// Route to logout and destroy the session
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Error logging out');
    }
    res.send('<h1>Logged out successfully</h1><a href="/">Go to Login</a>');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
