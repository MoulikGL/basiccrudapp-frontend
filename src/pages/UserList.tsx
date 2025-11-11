import React, { useEffect, useState } from "react";
import styles from "./UserList.module.css";
import { useNotification } from "../NotificationProvider";

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  company: string;
}

const USERS_PER_PAGE = 5;

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const apiUrl = (import.meta.env.VITE_API_BASE_URL as string) || "";
  const { show } = useNotification();

  const load = async () => {
    if (!apiUrl) {
      console.error("VITE_API_BASE_URL is not defined.");
      show?.("API base URL is not configured.", "error");
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/user`);
      if (!res.ok) {
        show?.("Failed to fetch users from API", "error");
        setUsers([]);
        return;
      }
      const data = await res.json().catch(() => null);
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error loading users:", err);
      show?.("Error loading users", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load(); 
  }, [apiUrl]);

  const totalPages = Math.max(1, Math.ceil(users.length / USERS_PER_PAGE));
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [users.length, totalPages]);
  const currentUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;
    if (!apiUrl) {
      show?.("API base URL is not configured.", "error");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/user/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete user");
      show?.("User deleted successfully!", "success");
      await load(); 
    } catch (error) {
      console.error(error);
      show?.("Error deleting user. Please try again.", "error");
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    if (editingId === null) return;

    if (!editedUser.fullName || !editedUser.email) {
      show?.("Name and Email are required.", "error");
      return;
    }

    const original = users.find((u) => u.id === editingId) || ({} as User);
    const updatedUser: User = {
      ...original,
      ...editedUser,
    } as User;

    if (!apiUrl) {
      show?.("API base URL is not configured.", "error");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/user/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error(`Failed to update user: ${res.status}`);

      show?.("User updated successfully!", "success");
      await load(); 
    } catch (err) {
      console.error("Error updating user:", err);
      show?.("Failed to update user.", "error");
    } finally {
      setEditingId(null);
      setEditedUser({});
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>User Management</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editedUser.fullName ?? ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        fullName: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.fullName
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="email"
                    value={editedUser.email ?? ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editedUser.phoneNumber ?? ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.phoneNumber
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editedUser.address ?? ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        address: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.address
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editedUser.company ?? ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        company: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.company
                )}
              </td>
              <td className={styles.actions}>
                {editingId === user.id ? (
                  <>
                    <button className={styles.save} onClick={handleSave}>
                      💾 Save
                    </button>
                    <button
                      className={styles.cancel}
                      onClick={() => {
                        setEditingId(null);
                        setEditedUser({});
                      }}
                    >
                      ✖ Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.edit} onClick={() => handleEdit(user)}>
                      ✏️ Edit
                    </button>
                    <button className={styles.delete} onClick={() => handleDelete(user.id)}>
                      🗑️ Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={i + 1 === currentPage ? styles.activePage : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default UserList;