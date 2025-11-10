import React, { useEffect, useState } from "react";
import styles from "./UserList.module.css";

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  company: string;
}

const USERS_PER_PAGE = 5;
const STORAGE_KEY = "userlist_local_cache_v1";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

   useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const cached = JSON.parse(raw) as User[];
          setUsers(cached);
          return;
        }

        // fallback to API
        const res = await fetch(`${apiUrl}/user`);
        if (!res.ok) {
          console.warn("Failed to fetch users from API, using empty list.");
          setUsers([]);
          return;
        }
        const data = await res.json();
        // if API returned array or object with data property, handle both
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setUsers(list);

        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
      } catch (err) {
        console.error("Error loading users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    
  }, []);

  const totalPages = Math.max(1, Math.ceil(users.length / USERS_PER_PAGE));
  const currentUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const persist = (next: User[]) => {
    setUsers(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn("Could not save to localStorage", err);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this user?")) {
      persist(users.filter((u) => u.id !== id));

      const newTotalPages = Math.max(1, Math.ceil((users.length - 1) / USERS_PER_PAGE));
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditedUser({ ...user }); 
  };

  const handleSave = () => {
    if (editingId === null) return;

    if (!editedUser.fullName || !editedUser.email) {
      alert("Name and Email are required.");
      return;
    }

    const next = users.map((u) =>
      u.id === editingId
        ? {
            ...u,
            fullName: editedUser.fullName ?? u.fullName,
            email: editedUser.email ?? u.email,
            phoneNumber: editedUser.phoneNumber ?? u.phoneNumber,
            address: editedUser.address ?? u.address,
            company: editedUser.company ?? u.company,
          }
        : u
    );

    persist(next);
    setEditingId(null);
    setEditedUser({});
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
                    value={editedUser.fullName ?? ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, fullName: e.target.value })
                    }
                  />
                ) : (
                  user.fullName
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
              <td>
                {editingId === user.id ? (
                  <input
                    value={editedUser.phoneNumber ?? ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, phoneNumber: e.target.value })
                    }
                  />
                ) : (
                  user.phoneNumber
                )}
              </td>

              <td>
                {editingId === user.id ? (
                  <input
                    value={editedUser.address ?? ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, address: e.target.value })
                    }
                  />
                ) : (
                  user.address
                )}
              </td>

              <td>
                {editingId === user.id ? (
                  <input
                    value={editedUser.company ?? ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, company: e.target.value })
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