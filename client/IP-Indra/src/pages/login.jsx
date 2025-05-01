import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { api } from "../helpers/http-client";

export default function Login() {
  const access_token = localStorage.getItem("access_token");

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (access_token) {
    return <Navigate to={"/"} />;
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 min-vw-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="d-flex shadow-lg rounded"
        style={{ width: "900px", minHeight: "500px", overflow: "hidden" }}
      >
        <div
          className="bg-white p-5 d-flex flex-column justify-content-center"
          style={{ flex: 1 }}
        >
          <form onSubmit={handleLogin}>
            <div className="mb-4 text-center">
              <h1 className="fw-bold">Login</h1>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-4 w-100">
              Login
            </button>
            <p className="text-center mt-3">
              Don't have an account? <Link to="/register">Register Now</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
