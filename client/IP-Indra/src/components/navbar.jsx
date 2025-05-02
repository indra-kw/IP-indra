import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
// import Logo from "../assets/ML.png";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <div className="container">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <Link to={"/"} className="navbar-brand">
              Home
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    to={"/favorite"}
                    className="nav-link active"
                    aria-current="page"
                  >
                    My Favorite
                  </Link>
                </li>
                {isLoggedIn && (
                  <li className="nav-item">
                    <Link
                      to={"/profile"}
                      className="nav-link active"
                      aria-current="page"
                    >
                      Profile
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  {isLoggedIn ? (
                    <button onClick={handleLogout} className="nav-link active">
                      Logout
                    </button>
                  ) : (
                    <Link to={"/login"} className="nav-link active">
                      Login
                    </Link>
                  )}
                </li>
              </ul>
              <form className="d-flex" role="search" onSubmit={handleSearch}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search hero"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
