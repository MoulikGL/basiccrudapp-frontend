import React, { useEffect, useState } from "react";
import styles from "./UserList.module.css";

interface User {
  id: number;
  name: string;
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
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${apiUrl}/user`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const currentUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditedUser(user);
  };

  const handleSave = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === editingId ? { ...u, ...editedUser } : u))
    );
    setEditingId(null);
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
                    value={editedUser.name ?? ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, name: e.target.value })
                    }
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    value={editedUser.email ?? ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>{user.phoneNumber}</td>
              <td>{user.address}</td>
              <td>{user.company}</td>
              <td className={styles.actions}>
                {editingId === user.id ? (
                  <>
                    <button className={styles.save} onClick={handleSave}>
                      💾 Save
                    </button>
                    <button
                      className={styles.cancel}
                      onClick={() => setEditingId(null)}
                    >
                      ✖ Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={styles.edit}
                      onClick={() => handleEdit(user)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className={styles.delete}
                      onClick={() => handleDelete(user.id)}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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