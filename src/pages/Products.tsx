import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, CircularProgress, Tooltip, Box } from "@mui/material";
import { useNotification } from "../NotificationProvider";
import { useAuth } from "../auth/AuthProvider";
import authFetchOptions from "../utils/authFetchOptions";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const PRODUCTS_PER_PAGE = 5;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const { user: currentUser, token } = useAuth();
  const { show } = useNotification();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/product`, authFetchOptions(token));
      if (!res.ok) {
        show("Failed to fetch products from API.", "error");
        setProducts([]);
        return;
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setProducts(list);
    } catch (err) {
      show(`Failed to load products: ${err}`, "error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [apiUrl]);

  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [products.length, totalPages]);

  const currentProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${apiUrl}/product/${id}`,
        authFetchOptions(token, "DELETE")
      );
      if (!response.ok) throw new Error("Failed to delete product");
      show("Product deleted successfully!", "success");
      await load();
    } catch (err) {
      show(`Failed to delete product: ${err}`, "error");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
  };

  const handleSave = async () => {
    if (editingId === null) return;

    if (!editedProduct.name || !editedProduct.price) {
      show("Name and Price are required.", "error");
      return;
    }

    const updatedProduct = {
      ...products.find((p) => p.id === editingId),
      ...editedProduct,
    } as Product;

    try {
      const res = await fetch(
        `${apiUrl}/product/${editingId}`,
        authFetchOptions(token, "PUT", updatedProduct)
      );
      if (!res.ok) throw new Error(`Failed to update product: ${res.status}`);
      show("Product updated successfully!", "success");
      await load();
    } catch (err) {
      show(`Failed to update product: ${err}`, "error");
    } finally {
      setEditingId(null);
      setEditedProduct({});
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
          Product Management 📦
        </Typography>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "grey.400" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {currentProducts.map((p) => (
                <TableRow key={p.id} sx={{ "&:hover": { backgroundColor: "grey.100" } }}>
                  <TableCell>{p.id}</TableCell>

                  <TableCell>
                    {editingId === p.id ? (
                      <TextField
                        type="text"
                        value={editedProduct.name ?? ""}
                        onChange={(e) =>
                          setEditedProduct({ ...editedProduct, name: e.target.value })
                        }
                      />
                    ) : (
                      p.name
                    )}
                  </TableCell>

                  <TableCell>
                    {editingId === p.id ? (
                      <TextField
                        type="text"
                        value={editedProduct.description ?? ""}
                        onChange={(e) =>
                          setEditedProduct({ ...editedProduct, description: e.target.value })
                        }
                      />
                    ) : (
                      p.description
                    )}
                  </TableCell>

                  <TableCell>
                    {editingId === p.id ? (
                      <TextField
                        type="number"
                        value={editedProduct.price ?? ""}
                        onChange={(e) =>
                          setEditedProduct({ ...editedProduct, price: Number(e.target.value) })
                        }
                      />
                    ) : (
                      p.price
                    )}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {editingId === p.id ? (
                        <>
                          <Tooltip title="Save">
                            <Button variant="contained" color="success" onClick={handleSave}>
                              💾
                            </Button>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => {
                                setEditingId(null);
                                setEditedProduct({});
                              }}
                            >
                              ✖
                            </Button>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Edit">
                            <Button
                              variant="contained"
                              onClick={() => handleEdit(p)}
                              disabled={ !( currentUser?.isAdmin )}
                              sx={{
                                opacity: currentUser?.isAdmin ? 1 : 0.4,
                                cursor: currentUser?.isAdmin ? "pointer" : "not-allowed",
                              }}
                            >
                              ✏️
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button
                              variant="contained"
                              onClick={() => handleDelete(p.id)}
                              disabled={!currentUser?.isAdmin}
                              sx={{
                                opacity: currentUser?.isAdmin ? 1 : 0.4,
                                cursor: currentUser?.isAdmin ? "pointer" : "not-allowed",
                              }}
                            >
                              🗑️
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
              ◀
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
              ▶
            </Button>
          </Tooltip>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ProductList;