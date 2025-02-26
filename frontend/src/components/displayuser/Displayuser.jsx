import React, { useState } from "react";
import styles from "./Displayuser.module.css";
import { getFilterUsers } from "../../apis/user";
import Usersfield from "../usersfield/Usersfield";
import { toast } from "react-toastify";

function Displayuser({ users, setUsers, fetchAllUsers, isLoading: parentLoading }) {
  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isLoading, setIsLoading] = useState(false);  //loader

  const handleSearch = async () => {
    setIsLoading(true); 
    try {
      const res = await getFilterUsers(searchName, filterType);
      if (res.data) {
        setUsers(res.data);
      } else {
        setUsers([]);
        toast.info("No users found!");
      }
    } catch (err) {
      console.error("Error fetching filtered users:", err);
      toast.error("Failed to fetch users!");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className={styles.displayuser}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          name="name"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className={styles.searchInput}
        />
        <select
          name="type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Filter by type</option>
          <option value="child">Child</option>
          <option value="mother">Mother</option>
          <option value="father">Father</option>
          <option value="teacher">Teacher</option>
        </select>
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
      </div>
      <Usersfield users={users} fetchAllUsers={fetchAllUsers} isLoading={isLoading || parentLoading} />
    </div>
  );
}

export default Displayuser;