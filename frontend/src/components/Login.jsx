import { Link, Form, useActionData } from "react-router-dom";
import logoImg from '../pictures/pic2.jpg';
import './Login.css';

export default function Login() {
  const data = useActionData();

  return (
    <div className="login-page">
      <div className="login-right">
        <div className="login-card">
          <img src={logoImg} alt="Travel Planner" className="login-logo" />
          <h2>Welcome back</h2>
          <p className="login-subtitle">Sign in to your account to continue</p>

          {data?.error && (
            <div className="login-error">{data.error}</div>
          )}

          <Form method="post">
            <div className="login-field">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" required placeholder="Enter your username" />
            </div>
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required minLength={5} placeholder="Enter your password" />
            </div>
            <button type="submit" className="login-btn">Log In</button>
          </Form>

          <div className="login-footer">
            Don't have an account?
            <Link to="/signup">Sign up here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
