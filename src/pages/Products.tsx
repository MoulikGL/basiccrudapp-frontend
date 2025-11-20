import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, CircularProgress, Tooltip, Box, Avatar } from "@mui/material";
import { useNotification } from "../NotificationProvider";
import { useAuth } from "../auth/AuthProvider";
import authFetchOptions from "../utils/authFetchOptions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PictureAsPdf, TableChart, Download, Add, Inventory, Save, Cancel, Edit, Delete, ChevronLeft, ChevronRight } from "@mui/icons-material";
import notFoundImg from "../assets/404.png";
// import { put } from "@vercel/blob";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | null;
  imageurl: string;
}

const PRODUCTS_PER_PAGE = 5;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [creating, setCreating] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<Partial<Product>>({});
  // const [open, setOpen] = useState(false);
  const [createLabel, setCreateLabel] = useState("Upload");
  const [editLabel, setEditLabel] = useState("Upload");
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
      setProducts(
        list.sort((a: Product, b: Product) => a.id - b.id)
      );
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

  const nextId = products.length > 0  ? products[products.length - 1].id + 1  : 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [products.length, totalPages]);

  const currentProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const exportPDF = () => {
    const confirmed = window.confirm(
      "Export PDF?"
    );
    if (!confirmed) return;

    const doc = new jsPDF();
  
    const tableColumn = ["ID", "Name", "Description", "Price"];
    const tableRows: any[] = [];
  
    products.forEach((p) => {
      tableRows.push([p.id, p.name, p.description, p.price]);
    });
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });
  
    doc.save("products.pdf");
  };
  
  const exportExcel = () => {
    const confirmed = window.confirm(
      "Export Excel?"
    );
    if (!confirmed) return;

    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    saveAs(blob, "products.xlsx");
  };
  

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

    if (!editedProduct.name || editedProduct.price == null) {
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
      setEditLabel("Upload");
      await load();
    } catch (err) {
      show(`Failed to update product: ${err}`, "error");
    } finally {
      setEditingId(null);
      setEditedProduct({});
    }
  };

  const handleCreate = async () => {    
    if (!createdProduct.name || createdProduct.price == null) {
      show("Name and Price are required.", "error");
      return;
    }

    try {
      const res = await fetch(
        `${apiUrl}/product`,
        authFetchOptions(token, "POST", createdProduct)
      );
      if (!res.ok) throw new Error(`Failed to create product: ${res.status}`);
      show("Product created successfully!", "success");
      setCreateLabel("Upload");
      await load();
    } catch (err) {
      show(`Failed to create product: ${err}`, "error");
    } finally {
      setCreating(false);
      setCreatedProduct({});
    }
  };

  // const uploadBlob = async (file: File) => {
  //   const filenameSafe = `products/${Date.now()}-${file.name}`;
  //   const blob = await put(filenameSafe, file, {
  //     access: "public",
  //     token: import.meta.env.VITE_BLOB_READ_WRITE_TOKEN
  //   });
  //   return blob.url ?? blob?.downloadUrl ?? null;
  // };

  const handleCreateUpload = async (f: React.ChangeEvent<HTMLInputElement>) => {
    const file = f.target.files?.[0];
    if (file) {
      setCreateLabel(file.name);
      // try {
      //   const url = await uploadBlob(file);
      //   if (url) setCreatedProduct((prev) => ({ ...prev, imageurl: url }));
      // } catch (err) {
      //   show(`Image upload failed: ${err}`, "error");
      //   setCreateLabel("Upload");
      // }
    }
  };

  const handleEditUpload = async (f: React.ChangeEvent<HTMLInputElement>) => {
    const file = f.target.files?.[0];
    if (file) {
      setEditLabel(file.name);
      // try {
      //   const url = await uploadBlob(file);
      //   if (url) setEditedProduct((prev) => ({ ...prev, imageurl: url }));
      // } catch (err) {
      //   show(`Image upload failed: ${err}`, "error");
      //   setEditLabel("Upload");
      // }
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
        <Box sx={{ display: "flex", direction: "row", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Product Management
          </Typography>          

          <Tooltip title="Add Product">
            <Button
              variant="outlined"
              onClick={() => {
                setCreating(true);
                setCreatedProduct({ name: "", description: "", price: null });
              }}
            >
              <Inventory />
              <Add fontSize="small" />
            </Button>
          </Tooltip>

          <Tooltip title="Export Excel">
            <Button variant="outlined" onClick={exportExcel}>
              <TableChart />
              <Download fontSize="small" />
            </Button>
          </Tooltip>

          <Tooltip title="Export PDF">
            <Button variant="outlined" onClick={exportPDF}>
              <PictureAsPdf />
              <Download fontSize="small" />
            </Button>
          </Tooltip>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "grey.400" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {creating && (
                <TableRow sx={{ "&:hover": { backgroundColor: "grey.100" } }}>
                  <TableCell>{nextId}</TableCell>

                  <TableCell>
                    <TextField
                      label="Name"
                      type="text"
                      placeholder={`Product${nextId}`}
                      value={createdProduct.name ?? ""}
                      onChange={e => 
                        setCreatedProduct({ ...createdProduct, name: e.target.value })
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      label="Description"
                      type="text"
                      placeholder={`Sample Product ${nextId}`}
                      value={createdProduct.description ?? ""}
                      onChange={e => 
                        setCreatedProduct({ ...createdProduct, description: e.target.value })
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      label="Price"
                      type="number"
                      placeholder={`${nextId* 100}`}
                      value={createdProduct.price ?? ""}
                      onChange={e => 
                        setCreatedProduct({ ...createdProduct, price: Number(e.target.value) })
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <input id="file-upload" type="file" accept="image/*" hidden onChange={handleCreateUpload} />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        sx={{
                          borderColor: "grey.500",
                          color: "grey.500",
                          padding: "15px 20px",
                          textTransform: "none"
                        }}
                      >
                        {createLabel}
                      </Button>
                    </label>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Save">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleCreate}
                        >
                          <Save />
                        </Button>
                      </Tooltip>
                      
                      <Tooltip title="Cancel">
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            setCreating(false);
                            setCreatedProduct({});
                            setCreateLabel("Upload");
                          }}
                        >
                          <Cancel />
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

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
                    {editingId === p.id ? (
                      <>
                      <input id={`file-upload-${p.id}`} type="file" accept="image/*" hidden onChange={handleEditUpload} />
                      <label htmlFor={`file-upload-${p.id}`}>
                        <Button
                          variant="outlined"
                          component="span"
                          sx={{
                            borderColor: "grey.500",
                            color: "grey.500",
                            padding: "15px 20px",
                            textTransform: "none"
                          }}
                        >
                          {editLabel}
                        </Button>
                      </label>
                      </>
                    ) : (
                      <Avatar variant="square" src={p.imageurl || notFoundImg} />
                    )}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {editingId === p.id ? (
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
                                setEditedProduct({});
                                setEditLabel("Upload");
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
                              onClick={() => {
                                handleEdit(p);
                                setEditLabel("Upload");
                              }}
                              disabled={ !( currentUser?.isAdmin )}
                              sx={{
                                opacity: currentUser?.isAdmin ? 1 : 0.4,
                                cursor: currentUser?.isAdmin ? "pointer" : "not-allowed",
                              }}
                            >
                              <Edit />
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

export default ProductList;