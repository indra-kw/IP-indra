import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { api } from "../helpers/http-client";

export default function MyFavorite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Gemini AI related states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [currentHero, setCurrentHero] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  async function fetchFavorites() {
    try {
      setLoading(true);

      // Verify if user is logged in
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          title: "Authentication Required",
          text: "Please login first to view your favorites",
          icon: "warning",
          confirmButtonText: "Go to Login",
        }).then(() => {
          navigate("/login");
        });
        return;
      }

      const response = await api.get("https://ip.indrakw.store/favorite", {
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
        Swal.fire({
          title: "Authentication Required",
          text: "Please login first",
          icon: "warning",
          confirmButtonText: "Go to Login",
        }).then(() => {
          navigate("/login");
        });
        return;
      }

      await api.delete(`https://ip.indrakw.store/favorite/${id}`, {
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
        Swal.fire({
          title: "Connection Error",
          text: "Server is not available. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: `Failed to remove from favorites: ${
            error.response?.data?.message || error.message
          }`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle sending prompt to Gemini AI
  const handleGeminiAsk = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setAiError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          title: "Authentication Required",
          text: "Please login first",
          icon: "warning",
          confirmButtonText: "Go to Login",
        }).then(() => {
          navigate("/login");
        });
        return;
      }

      // Create a context-aware prompt about the current hero
      const contextPrompt = currentHero
        ? `Information about ${currentHero.hero_name} (${currentHero.hero_role}, ${currentHero.hero_specially}): ${aiPrompt}`
        : aiPrompt;

      // Using the api helper instead of direct axios call
      // This ensures we're using the baseURL configured in http-client.js
      const response = await api.post(
        "https://ip.indrakw.store/gemini/generate",
        {
          prompt: contextPrompt,
          model: "gemini-1.5-pro",
        },
        {
          timeout: 20000,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            question: aiPrompt,
          },
        }
      );

      setAiResponse(response.data.data);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setAiError("Failed to get response from Gemini AI. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Open modal with specific hero context
  const openHeroModal = (hero) => {
    setCurrentHero(hero);
    setAiPrompt("");
    setAiResponse("");
    setAiError(null);
  };

  // Reset AI states when modal closes
  const handleModalClose = () => {
    setAiPrompt("");
    setAiResponse("");
    setAiError(null);
    setCurrentHero(null);
  };

  // Suggestion buttons for quick prompts
  const suggestionPrompts = [
    "What are the best builds for this hero?",
    "How to counter this hero?",
    "What are the best emblems for this hero?",
    "What's the best gameplay strategy?",
  ];

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setAiPrompt(suggestion);
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
                <div className="d-grid gap-2">
                  {/* Button trigger Gemini AI modal */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target={`#geminiModal-${favorite.id}`}
                    onClick={() => openHeroModal(favorite)}
                  >
                    <i className="bi bi-robot me-2"></i>
                    Ask Gemini AI
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => removeFromFavorite(favorite.id)}
                    disabled={loading}
                  >
                    {loading ? "Removing..." : "Remove Favorite"}
                  </button>
                </div>

                {/* Gemini AI Modal */}
                <div
                  className="modal fade"
                  id={`geminiModal-${favorite.id}`}
                  tabIndex={-1}
                  aria-labelledby={`geminiModalLabel-${favorite.id}`}
                  aria-hidden="true"
                  data-bs-backdrop="static"
                  onClick={(e) =>
                    e.target.classList.contains("modal") && handleModalClose()
                  }
                >
                  <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                      <div className="modal-header bg-primary text-white">
                        <h1
                          className="modal-title fs-5"
                          id={`geminiModalLabel-${favorite.id}`}
                        >
                          <i className="bi bi-robot me-2"></i>
                          Ask Gemini AI about {favorite.hero_name}
                        </h1>
                        <button
                          type="button"
                          className="btn-close btn-close-white"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={handleModalClose}
                        />
                      </div>
                      <div className="modal-body">
                        <div className="hero-details mb-3 d-flex align-items-center">
                          <img
                            src={favorite.hero_avatar}
                            alt={favorite.hero_name}
                            className="img-thumbnail me-3"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <h4>{favorite.hero_name}</h4>
                            <div>
                              <span className="badge bg-secondary me-2">
                                {favorite.hero_role}
                              </span>
                              <span className="badge bg-info">
                                {favorite.hero_specially}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="suggestion-buttons mb-3">
                          <p className="small text-muted mb-2">
                            Quick questions:
                          </p>
                          <div className="d-flex flex-wrap gap-2">
                            {suggestionPrompts.map((suggestion, index) => (
                              <button
                                key={index}
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                                disabled={aiLoading}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>

                        <form onSubmit={handleGeminiAsk} className="mb-4">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ask anything about this hero or Mobile Legends..."
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              disabled={aiLoading}
                            />
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={!aiPrompt.trim() || aiLoading}
                            >
                              {aiLoading ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Thinking...
                                </>
                              ) : (
                                <>Ask</>
                              )}
                            </button>
                          </div>
                        </form>

                        {aiError && (
                          <div className="alert alert-danger mb-3">
                            {aiError}
                          </div>
                        )}

                        {aiLoading && (
                          <div className="text-center py-4">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <p className="mt-3">
                              Gemini AI is thinking about your question...
                            </p>
                          </div>
                        )}

                        {aiResponse && !aiLoading && (
                          <div className="ai-response">
                            <div className="card bg-light">
                              <div className="card-header bg-primary text-white">
                                <i className="bi bi-robot me-2"></i>
                                Gemini AI Response
                              </div>
                              <div className="card-body">
                                <div
                                  className="response-content"
                                  dangerouslySetInnerHTML={{
                                    __html: aiResponse.replace(/\n/g, "<br>"),
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {!aiResponse && !aiLoading && !aiError && (
                          <div className="text-center py-3 text-muted">
                            <i className="bi bi-robot fs-1 mb-3"></i>
                            <p>
                              Ask Gemini AI anything about {favorite.hero_name}{" "}
                              or Mobile Legends!
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                          onClick={handleModalClose}
                        >
                          Close
                        </button>
                        {aiResponse && (
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setAiPrompt("");
                              setAiResponse("");
                            }}
                          >
                            <i className="bi bi-arrow-counterclockwise me-1"></i>
                            New Question
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
