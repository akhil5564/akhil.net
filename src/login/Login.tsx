import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import React from 'react';

const Login: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate to the next page

  const handleLogin = () => {
    if (username === 'sas' && password === 'pops') {
      localStorage.setItem('loggedInUser', 'sas'); // Store the username in localStorage
      navigate('/home', { state: { username } }); // Pass username to Home page
    } else if (username === 'kjp' && password === '400') {
      localStorage.setItem('loggedInUser', 'kjp'); // Store the username in localStorage
      navigate('/shome', { state: { username } });
    } else if (username === 'syn' && password === 'siyan') {
      localStorage.setItem('loggedInUser', 'syn'); // Store the username in localStorage
      navigate('/shome', { state: { username } });
    } else if (username === 'cdn' && password === '900') {
      localStorage.setItem('loggedInUser', 'cdn'); // Store the username in localStorage
      navigate('/shome', { state: { username } });
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
