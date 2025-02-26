import React from "react";
import styles from "./Usersfield.module.css";
import { deleteUser } from "../../apis/user";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

function Usersfield({ users, fetchAllUsers, isLoading }) {
  const handleDeleteUser = async (id) => {
    try {
      const res = await deleteUser(id);
      if (res.status === 200) {
        toast.success(res.data.message);
        fetchAllUsers(); // Refresh list
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to delete user!");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  }

  return (
    <div className={styles.usersList}>
      {users?.length > 0 ? (
        users.map((item) => (
          <div className={styles.userCard} key={item.id}>
            <div className={styles.userInfo}>
              <h3>{item.name}</h3>
              <p>Type: {item.type}</p>
            </div>
            <MdDelete
              onClick={() => handleDeleteUser(item.id)}
              className={styles.deleteIcon}
            />
          </div>
        ))
      ) : (
        <p className={styles.noData}>No users found</p>
      )}
    </div>
  );
}

export default Usersfield;