import React, { useEffect, useState } from "react";
import styles from "./UserList.module.css";
import { useNotification } from "../NotificationProvider";
import { useAuth } from "../auth/AuthProvider";
import authFetchOptions from "../utils/authFetchOptions";

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  company: string;
  isAdmin: boolean;
}

const USERS_PER_PAGE = 5;

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const { user: currentUser, token } = useAuth();
  const { show } = useNotification();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/user`, authFetchOptions(token));
      if (!res.ok) {
        show("Failed to fetch users from API", "error");
        setUsers([]);
        return;
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setUsers(list);
    } catch (err) {
      console.error("Error loading users:", err);
      show("Error loading users", "error");
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${apiUrl}/user/${id}`,
        authFetchOptions(token, "DELETE")
      );
      if (!response.ok) throw new Error("Failed to delete user");
      show("User deleted successfully!", "success");
      await load();
    } catch (error) {
      console.error(error);
      show("Error deleting user. Please try again.", "error");
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    if (editingId === null) return;

    if (!editedUser.fullName || !editedUser.email) {
      show("Name and Email are required.", "error");
      return;
    }

    const updatedUser = {
      ...users.find((u) => u.id === editingId),
      ...editedUser,
    } as User;

    try {
      const res = await fetch(
        `${apiUrl}/user/${editingId}`,
        authFetchOptions(token, "PUT", updatedUser)
      );
      if (!res.ok) throw new Error(`Failed to update user: ${res.status}`);

      show("User updated successfully!", "success");
      await load();
    } catch (err) {
      console.error("Error updating user:", err);
      show("Failed to update user.", "error");
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
          {currentUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>

              <td>
                {editingId === u.id ? (
                  <input
                    type="text"
                    value={editedUser.fullName ?? ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, fullName: e.target.value })
                    }
                  />
                ) : (
                  u.fullName
                )}
              </td>

              <td>
                {editingId === u.id ? (
                  <input
                    type="email"
                    value={editedUser.email ?? ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                  />
                ) : (
                  u.email
                )}
              </td>

              <td>
                {editingId === u.id ? (
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
                  u.phoneNumber
                )}
              </td>

              <td>
                {editingId === u.id ? (
                  <input
                    type="text"
                    value={editedUser.address ?? ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, address: e.target.value })
                    }
                  />
                ) : (
                  u.address
                )}
              </td>

              <td>
                {editingId === u.id ? (
                  <input
                    type="text"
                    value={editedUser.company ?? ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, company: e.target.value })
                    }
                  />
                ) : (
                  u.company
                )}
              </td>

              <td className={styles.actions}>
                {editingId === u.id ? (
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
                    {currentUser?.id === u.id || currentUser?.isAdmin ? (
                      <button
                        className={styles.edit}
                        onClick={() => handleEdit(u)}
                      >
                        ✏️ Edit
                      </button>
                    ) : (
                      <button
                        className={styles.edit}
                        disabled
                        style={{ opacity: 0.4, cursor: "not-allowed" }}
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {currentUser?.isAdmin ? (
                      <button
                        className={styles.delete}
                        onClick={() => handleDelete(u.id)}
                      >
                        🗑️ Delete
                      </button>
                    ) : (
                      <button
                        className={styles.delete}
                        disabled
                        style={{ opacity: 0.4, cursor: "not-allowed" }}
                      >
                        🗑️ Delete
                      </button>
                    )}
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
            key={i + 1}
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