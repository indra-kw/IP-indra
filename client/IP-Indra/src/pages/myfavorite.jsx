import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function MyFavorite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  async function fetchFavorites() {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please login to view favorites");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:3009/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavorites(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch favorites");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.delete(`http://localhost:3009/favorites/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchFavorites();
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Failed to remove from favorites");
    }
  };

  if (loading)
    return (
      <div className="container py-4 text-center">Loading favorites...</div>
    );

  if (error)
    return (
      <div className="container py-4 text-center text-danger">{error}</div>
    );

  if (favorites.length === 0) {
    return (
      <div className="container py-4 text-center">
        You don't have any favorites yet.
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">My Favorite Heroes</h2>
      <div className="row g-4">
        {favorites.map((favorite) => (
          <div className="col-12 col-md-6 col-lg-3" key={favorite.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={favorite.hero_avatar || favorite.hero?.hero_avatar}
                className="card-img-top img-fluid"
                alt={favorite.hero_name || favorite.hero?.hero_name || "Hero"}
                onError={handleImageError}
              />
              <div className="card-body text-center">
                <h5 className="card-title">
                  {favorite.hero_name ||
                    favorite.hero?.hero_name ||
                    "Hero Name"}
                </h5>
                <p className="card-text">
                  {favorite.hero_role ||
                    favorite.hero?.hero_role ||
                    "No description available"}
                </p>
                <p className="card-text">
                  {favorite.hero_specially ||
                    favorite.hero?.hero_specially ||
                    "No description available"}
                </p>
                <button
                  className="btn btn-danger"
                  onClick={() => removeFavorite(favorite.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
