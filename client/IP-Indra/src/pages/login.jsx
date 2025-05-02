import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router"; // Fix import
import { api } from "../helpers/http-client";

export default function Login() {
  const access_token = localStorage.getItem("access_token");

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleInitialized, setGoogleInitialized] = useState(false);

  useEffect(() => {
    // Only initialize Google Sign-In once
    if (window.google && !googleInitialized) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              const { data } = await api.post("/authgoogle", {
                googleToken: response.credential,
              });
              console.log(response);

              localStorage.setItem("access_token", data.access_token);
              navigate("/");
            } catch (error) {
              console.error("Google OAuth error:", error);
            }
          },
          cancel_on_tap_outside: false,
        });

        // Only render the button if the buttonDiv element exists
        const buttonDiv = document.getElementById("buttonDiv");
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: "outline",
            size: "large",
            type: "standard",
          });
        }

        // Call prompt only once
        setTimeout(() => {
          window.google.accounts.id.prompt();
        }, 1000);

        setGoogleInitialized(true);
      } catch (err) {
        console.error("Failed to initialize Google Sign-In:", err);
      }
    }
  }, [navigate, googleInitialized]);

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
            <div className="text-center mt-3 mb-2">
              <span>or</span>
            </div>
            <div id="buttonDiv" className="d-flex justify-content-center"></div>
            <p className="text-center mt-3">
              Don't have an account? <Link to="/register">Register Now</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
