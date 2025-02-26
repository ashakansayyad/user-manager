import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { getLoggedUserData } from "../../apis/user";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
  const [loggedUserData, setLoggedUserData] = useState("");
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found, please log in!");
        navigate("/login"); // Redirect to login if no token
        return;
      }
      const decoded = jwtDecode(token);
      const userId = decoded?.id;

      const res = await getLoggedUserData(userId);
      if (res.data) {
        setLoggedUserData(res.data.name);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Failed to load user data!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login"); // Redirect to login
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>User Manager</h1>
      <div className={styles.userSection}>
        <span className={styles.welcomeText}>
          Welcome, <p>{loggedUserData || "User"}</p>
        </span>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;