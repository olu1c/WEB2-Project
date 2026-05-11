import { Form, useActionData } from "react-router-dom";
import { Link } from "react-router-dom";
import logoImg from '../pictures/pic2.jpg';
import './Login.css';

export default function Signup() {
  const data = useActionData();

  return (
    <div className="login-page">
      <div className="login-right">
        <div className="login-card">
          <img src={logoImg} alt="Travel Planner" className="login-logo" />
          <h2>Create an account</h2>
          <p className="login-subtitle">Start planning your trips today</p>

          {data?.error && (
            <div className="login-error">{data.error}</div>
          )}

          <Form method="post">
            <div className="login-field">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" required placeholder="Enter your username" />
            </div>
            <div className="login-field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="Enter your email" />
            </div>
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required minLength={5} placeholder="Create a password" />
            </div>
            <button type="submit" className="login-btn">Sign Up</button>
          </Form>

          <div className="login-footer">
            Already have an account?
            <Link to="/login">Log in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
