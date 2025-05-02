import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../helpers/http-client";

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    // Add more user details as needed
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleEdit = () => {
    navigate("/edit-profile"); // Navigate to the edit profile page
  };

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">User Profile</h4>
            </div>
            <div className="card-body">
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label fw-bold">
                  Email:
                </label>
                <div className="col-sm-9">
                  <p className="form-control-plaintext">{user.email}</p>
                </div>
              </div>

              {/* You can add more profile details here */}

              <div className="d-grid gap-2 mt-4">
                <button
                  onClick={handleEdit}
                  className="btn btn-outline-primary"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
