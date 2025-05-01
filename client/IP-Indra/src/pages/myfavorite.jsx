import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function MyFavorite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  async function fetchFavorites() {
    try {
      setLoading(true);

      // Verify if user is logged in
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Please login first to view your favorites");
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:3009/favorite", {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavorites(response.data);
      setError(null);
    } catch (error) {
      console.log("Error fetching favorites:", error);
      if (
        error.code === "ERR_CONNECTION_REFUSED" ||
        error.code === "ECONNREFUSED"
      ) {
        console.warn("Using dummy data because API is not available");
        setFavorites([]);
        setError("Cannot connect to the server. Using sample data instead.");
      } else {
        setError(`Failed to load favorites: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  // Remove from favorites
  const removeFromFavorite = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      await axios.delete(`http://localhost:3009/favorite/${id}`, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the list after removal
      fetchFavorites();
    } catch (error) {
      console.error("Error removing from favorites:", error);
      if (
        error.code === "ERR_CONNECTION_REFUSED" ||
        error.code === "ECONNREFUSED"
      ) {
        alert("Server is not available. Please try again later.");
      } else {
        alert(
          `Failed to remove from favorites: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [navigate]);

  // Calculate pagination
  const indexOfLastHero = currentPage * itemsPerPage;
  const indexOfFirstHero = indexOfLastHero - itemsPerPage;
  const currentFavorites = favorites.slice(indexOfFirstHero, indexOfLastHero);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">My Favorite Heroes</h2>

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      {favorites.length === 0 && !loading && !error && (
        <div className="text-center py-5">
          <p>You don't have any favorite heroes yet.</p>
          <button
            className="btn btn-primary mt-2"
            onClick={() => navigate("/")}
          >
            Browse Heroes
          </button>
        </div>
      )}

      <div className="row g-4">
        {currentFavorites.map((favorite) => (
          <div className="col-12 col-md-6 col-lg-3" key={favorite.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={favorite.hero_avatar}
                className="card-img-top img-fluid"
                alt={favorite.hero_name}
              />
              <div className="card-body text-center">
                <h5 className="card-title">
                  {favorite.hero_name || "Hero Name"}
                </h5>
                <div className="mb-3">
                  <span className="badge bg-secondary me-2">
                    {favorite.hero_role || "Unknown Role"}
                  </span>
                  <span className="badge bg-info">
                    {favorite.hero_specially || "Unknown Specialty"}
                  </span>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => removeFromFavorite(favorite.id)}
                  disabled={loading}
                >
                  {loading ? "Removing..." : "Remove Favorite"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {favorites.length > 0 && (
        <div className="mt-4">
          <nav>
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {Array.from({
                length: Math.ceil(favorites.length / itemsPerPage),
              }).map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === Math.ceil(favorites.length / itemsPerPage)
                    ? "disabled"
                    : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage === Math.ceil(favorites.length / itemsPerPage)
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
