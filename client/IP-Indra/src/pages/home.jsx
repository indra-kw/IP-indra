import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";

export default function Home() {
  const [hero, setHero] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  // Filter
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [role, setRoles] = useState([]);
  // Search
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  // Sort By
  const [specially, setSpecialties] = useState([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
  // Add Favorite
  const [addingToFavorite, setAddingToFavorite] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  async function addToFavorite(hero) {
    try {
      setAddingToFavorite(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        Swal.fire({
          title: "Authentication Required",
          text: "Please login first to add favorites",
          icon: "warning",
          confirmButtonText: "Go to Login",
        }).then(() => {
          navigate("/login");
        });
        return;
      }
      const heroData = {
        hero_name: hero.hero_name,
        hero_avatar: hero.hero_avatar,
        hero_role: hero.hero_role,
        hero_specially: hero.hero_specially,
      };
      const response = await axios.post(
        "http://localhost:3009/hero",
        heroData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/favorite");
    } catch (error) {
      console.error("Error adding hero to favorites:", error);
    } finally {
      setAddingToFavorite(false);
    }
  }

  const getSearchQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("search") || "";
  };
  async function fetchRoles() {
    try {
      const response = await axios.get(
        "https://api.dazelpro.com/mobile-legends/role",
        {
          timeout: 5000,
        }
      );
      if (response.data && response.data.role) {
        const formattedRoles = response.data.role.map((role, index) => ({
          role_id: index + 1,
          role_name: role.role_name,
        }));
        setRoles(formattedRoles);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.log("Error fetching roles:", error);
      setRoles([
        { role_id: 1, role_name: "Marksman" },
        { role_id: 2, role_name: "Tank" },
        { role_id: 3, role_name: "Mage" },
        { role_id: 4, role_name: "Fighter" },
        { role_id: 5, role_name: "Assassin" },
        { role_id: 6, role_name: "Support" },
      ]);
    }
  }
  async function fetchSpecialties() {
    try {
      const response = await axios.get(
        "https://api.dazelpro.com/mobile-legends/specially",
        {
          timeout: 5000,
        }
      );
      if (response.data && response.data.specially) {
        const formattedSpecialties = response.data.specially.map(
          (specialty, index) => ({
            specially_id: index + 1,
            specially_name: specialty.specially_name,
          })
        );
        setSpecialties(formattedSpecialties);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.log("Error fetching specialties:", error);
      setSpecialties([
        { specially_id: 1, specially_name: "Burst" },
        { specially_id: 2, specially_name: "Charge" },
        { specially_id: 3, specially_name: "Chase" },
        { specially_id: 4, specially_name: "Control" },
        { specially_id: 5, specially_name: "Damage" },
        { specially_id: 6, specially_name: "Poke" },
        { specially_id: 7, specially_name: "Push" },
        { specially_id: 8, specially_name: "Regen" },
        { specially_id: 9, specially_name: "Siege" },
      ]);
    }
  }
  async function fetchHero() {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3009/hero", {
        timeout: 5000,
      });
      setHero(response.data);
      setError(null);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  async function getHeroesByRole(roleId) {
    if (!roleId) {
      fetchHero();
      return;
    }
    try {
      setLoading(true);
      const selectedRole = role.find(
        (role) => role.role_id.toString() === roleId.toString()
      );
      if (!selectedRole) {
        throw new Error("Role not found");
      }
      const response = await axios.get("http://localhost:3009/hero", {
        timeout: 5000,
      });
      const filteredHeroes = response.data.filter(
        (hero) => hero.hero_role === selectedRole.role_name
      );
      setHero(filteredHeroes);
      setError(null);
    } catch (error) {
      console.log("Error filtering heroes by role:", error);
      setError(`Failed to filter heroes by role: ${error.message}`);
      fetchHero();
    } finally {
      setLoading(false);
    }
  }
  async function getHeroesBySpecialty(specialtyId) {
    if (!specialtyId) {
      if (selectedRoleId) {
        getHeroesByRole(selectedRoleId);
      } else {
        fetchHero();
      }
      return;
    }
    try {
      setLoading(true);
      const selectedSpecialty = specially.find(
        (specialty) =>
          specialty.specially_id.toString() === specialtyId.toString()
      );
      if (!selectedSpecialty) {
        throw new Error("Specialty not found");
      }
      const response = await axios.get("http://localhost:3009/hero", {
        timeout: 5000,
      });
      const filteredHeroes = response.data.filter(
        (hero) => hero.hero_specially === selectedSpecialty.specially_name
      );
      if (selectedRoleId && selectedRoleId !== "") {
        const selectedRole = role.find(
          (role) => role.role_id.toString() === selectedRoleId.toString()
        );
        if (selectedRole) {
          const doubleFilteredHeroes = filteredHeroes.filter(
            (hero) => hero.hero_role === selectedRole.role_name
          );
          setHero(doubleFilteredHeroes);
        } else {
          setHero(filteredHeroes);
        }
      } else {
        setHero(filteredHeroes);
      }
      setError(null);
    } catch (error) {
      console.log("Error filtering heroes by specialty:", error);
      setError(`Failed to filter heroes by specialty: ${error.message}`);
      fetchHero();
    } finally {
      setLoading(false);
    }
  }
  async function searchHeroes(query) {
    if (!query) {
      setIsSearching(false);
      return;
    }
    try {
      setLoading(true);
      setIsSearching(true);
      const response = await axios.get("http://localhost:3009/hero", {
        timeout: 5000,
      });
      const filteredHeroes = response.data.filter(
        (hero) =>
          hero.hero_name.toLowerCase().includes(query.toLowerCase()) ||
          (hero.hero_role &&
            hero.hero_role.toLowerCase().includes(query.toLowerCase())) ||
          (hero.hero_specially &&
            hero.hero_specially.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filteredHeroes);
      setError(null);
    } catch (error) {
      console.log("Error searching heroes:", error);
      setError(`Failed to search heroes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }
  const resetSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
    navigate("/", { replace: true });
    resetFilters();
  };
  const handleRoleChange = (e) => {
    if (isSearching) {
      resetSearch();
    }
    const roleId = e.target.value;
    setSelectedRoleId(roleId);
    setCurrentPage(1);
    getHeroesByRole(roleId);
  };
  const handleSpecialtyChange = (e) => {
    if (isSearching) {
      resetSearch();
    }
    const specialtyId = e.target.value;
    setSelectedSpecialtyId(specialtyId);
    setCurrentPage(1);
    getHeroesBySpecialty(specialtyId);
  };
  const resetFilters = () => {
    setSelectedRoleId("");
    setSelectedSpecialtyId("");
    setCurrentPage(1);
    fetchHero();
  };
  useEffect(() => {
    const query = getSearchQuery();
    if (query) {
      searchHeroes(query);
    } else {
      fetchHero();
    }
    fetchRoles();
    fetchSpecialties();
  }, [location.search]);

  const indexOfLastHero = currentPage * itemsPerPage;
  const indexOfFirstHero = indexOfLastHero - itemsPerPage;
  const heroesToDisplay = isSearching ? searchResults : hero;
  const currentHeroes = heroesToDisplay.slice(
    indexOfFirstHero,
    indexOfLastHero
  );
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
        <p className="mt-2">Loading heroes...</p>
      </div>
    );
  }
  return (
    <div className="container py-4">
      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}
      {isSearching && (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <span>
            Showing search results for: <strong>"{getSearchQuery()}"</strong>
            {searchResults.length > 0
              ? ` (${searchResults.length} results found)`
              : " (No results found)"}
          </span>
          <button className="btn btn-sm btn-outline-dark" onClick={resetSearch}>
            Clear Search
          </button>
        </div>
      )}
      {!isSearching && (
        <div className="mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <label className="me-2">Filter by Role:</label>
              <select
                className="form-select form-select-sm"
                value={selectedRoleId}
                onChange={handleRoleChange}
              >
                <option value="">All</option>
                {role.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="me-2">Sort by Specialty:</label>
              <select
                className="form-select form-select-sm"
                value={selectedSpecialtyId}
                onChange={handleSpecialtyChange}
              >
                <option value="">All</option>
                {specially.map((specialty) => (
                  <option
                    key={specialty.specially_id}
                    value={specialty.specially_id}
                  >
                    {specialty.specially_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 text-end">
              <button
                className="btn btn-secondary btn-sm"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="row g-4">
        {currentHeroes.map((hero) => (
          <div className="col-12 col-md-6 col-lg-3" key={hero.id}>
            <div className="card h-100 shadow-sm">
              <img src={hero.hero_avatar} className="card-img-top img-fluid" />
              <div className="card-body text-center">
                <h5 className="card-title">{hero.hero_name || "Hero Name"}</h5>
                <div className="mb-3">
                  <span className="badge bg-secondary me-2">
                    {hero.hero_role || "Unknown Role"}
                  </span>
                  <span className="badge bg-info">
                    {hero.hero_specially || "Unknown Specialty"}
                  </span>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => addToFavorite(hero)}
                  disabled={addingToFavorite}
                >
                  {addingToFavorite ? "Adding..." : "Add Favorite"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {heroesToDisplay.length === 0 && !loading && !error && (
        <div className="text-center py-5">
          <p>No heroes found.</p>
        </div>
      )}
      {heroesToDisplay.length > 0 && (
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
                length: Math.ceil(heroesToDisplay.length / itemsPerPage),
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
                  currentPage ===
                  Math.ceil(heroesToDisplay.length / itemsPerPage)
                    ? "disabled"
                    : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(heroesToDisplay.length / itemsPerPage)
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
