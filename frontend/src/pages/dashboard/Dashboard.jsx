import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Navbar from "../../components/navbar/Navbar";
import { addUser, getAllUsers } from "../../apis/user";
import Displayuser from "../../components/displayuser/Displayuser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });
  const [error, setError] = useState({
    name: false,
    type: false,
  });

  const fetchAllUsers = async () => {
    setIsLoading(true); // Start loader
    try {
      const res = await getAllUsers();
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users!");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  const namePattern = /^[a-zA-Z\s]*$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isError = false;

    if (!formData.name) {
      setError((prev) => ({ ...prev, name: true }));
      toast.error("Name is required!");
      isError = true;
    } else if (!namePattern.test(formData.name)) {
      toast.error("Name can only contain alphabets.");
      isError = true;
    }
    if (!formData.type) {
      setError((prev) => ({ ...prev, type: true }));
      toast.error("Type is required!");
      isError = true;
    }

    if (!isError) {
      try {
        const { name, type } = formData;
        const userData = { name, type };
        const res = await addUser(userData);
        if (res.status === 201) {
          toast.success("User added successfully!");
          setFormData({ name: "", type: "" }); // Reset form
          fetchAllUsers(); // Refresh user list
        }
      } catch (err) {
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Failed to add user!");
        }
      }
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(()=>{
    if(!token){
      navigate("/login")   //it not token then redirect to login
    }
  },[]);
  return (
    <div className={styles.dashboard}>
      <Navbar />
      <div className={styles.addUserContainer}>
        <h3 className={styles.sectionTitle}>Add New User</h3>
        <form onSubmit={handleSubmit} className={styles.addUserForm}>
          <input
            type="text"
            placeholder="Enter user name"
            name="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setError((prev) => ({ ...prev, name: false }));
            }}
            className={`${styles.input} ${error.name ? styles.error : ""}`}
          />
          <select
            name="type"
            value={formData.type}
            onChange={(e) => {
              setFormData({ ...formData, type: e.target.value });
              setError((prev) => ({ ...prev, type: false }));
            }}
            className={`${styles.select} ${error.type ? styles.error : ""}`}
          >
            <option value="">Select Type</option>
            <option value="child">Child</option>
            <option value="mother">Mother</option>
            <option value="father">Father</option>
            <option value="teacher">Teacher</option>
          </select>
          <button type="submit" className={styles.addButton}>
            Add User
          </button>
        </form>
      </div>
      <Displayuser
        users={users}
        fetchAllUsers={fetchAllUsers}
        setUsers={setUsers}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Dashboard;