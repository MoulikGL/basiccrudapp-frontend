import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, CircularProgress, Tooltip, Box } from "@mui/material";
import { useNotification } from "../NotificationProvider";
import { useAuth } from "../auth/AuthProvider";
import authFetchOptions from "../utils/authFetchOptions";
import { Save, Cancel, Edit, Delete, ChevronLeft, ChevronRight } from "@mui/icons-material";

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: number;
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
        show("Failed to fetch users from API.", "error");
        setUsers([]);
        return;
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setUsers(
        list.sort((a: User, b: User) => a.id - b.id)
      );
    } catch (err) {
      show(`Failed to load users: ${err}`, "error");
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
    } catch (err) {
      show(`Failed to delete user: ${err}`, "error");
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
      show(`Failed to update user: ${err}`, "error");
    } finally {
      setEditingId(null);
      setEditedUser({});
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, width: "fit-content", margin: "auto" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          User Management
        </Typography>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "grey.400" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {currentUsers.map((u) => (
                <TableRow key={u.id} sx={{ "&:hover": { backgroundColor: "grey.100" } }}>
                  <TableCell>{u.id}</TableCell>

                  <TableCell>
                    {editingId === u.id ? (
                      <TextField
                        type="text"
                        value={editedUser.fullName ?? ""}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, fullName: e.target.value })
                        }
                      />
                    ) : (
                      u.fullName
                    )}
                  </TableCell>

                  <TableCell>
                    {editingId === u.id ? (
                      <TextField
                        type="email"
                        value={editedUser.email ?? ""}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, email: e.target.value })
                        }
                      />
                    ) : (
                      u.email
                    )}
                  </TableCell>

                  <TableCell>
                    {editingId === u.id ? (
                      <TextField
                        type="number"
                        value={editedUser.phoneNumber ?? ""}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, phoneNumber: Number(e.target.value) })
                        }
                      />
                    ) : (
                      u.phoneNumber
                    )}
                  </TableCell>

                  <TableCell>
                    {editingId === u.id ? (
                      <TextField
                        type="text"
                        value={editedUser.address ?? ""}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, address: e.target.value })
                        }
                      />
                    ) : (
                      u.address
                    )}
                  </TableCell>

                  <TableCell>
                    {editingId === u.id ? (
                      <TextField
                        type="text"
                        value={editedUser.company ?? ""}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, company: e.target.value })
                        }
                      />
                    ) : (
                      u.company
                    )}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {editingId === u.id ? (
                        <>
                          <Tooltip title="Save">
                            <Button variant="contained" color="success" onClick={handleSave}>
                              <Save />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => {
                                setEditingId(null);
                                setEditedUser({});
                              }}
                            >
                              <Cancel />
                            </Button>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Edit">
                            <Button
                              variant="contained"
                              onClick={() => handleEdit(u)}
                              disabled={ !( currentUser?.id === u.id || currentUser?.isAdmin )}
                              sx={{
                                opacity: currentUser?.id === u.id || currentUser?.isAdmin ? 1 : 0.4,
                                cursor: currentUser?.id === u.id || currentUser?.isAdmin ? "pointer" : "not-allowed",
                              }}
                            >
                              <Edit />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button
                              variant="contained"
                              onClick={() => handleDelete(u.id)}
                              disabled={!currentUser?.isAdmin}
                              sx={{
                                opacity: currentUser?.isAdmin ? 1 : 0.4,
                                cursor: currentUser?.isAdmin ? "pointer" : "not-allowed",
                              }}
                            >
                              <Delete />
                            </Button>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: 2 }}>
          <Tooltip title="Prev">
            <Button
              variant="contained"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </Button>
          </Tooltip>

          <Typography sx={{ display: "flex", alignItems: "center" }}>
            Page {currentPage} of {totalPages}
          </Typography>

          <Tooltip title="Next">
            <Button
              variant="contained"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </Button>
          </Tooltip>
        </Stack>
      </Paper>
    </Container>
  );
};

export default UserList;