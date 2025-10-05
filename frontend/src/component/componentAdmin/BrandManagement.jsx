import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import DataTable from "react-data-table-component";
import {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} from "../../api/brandApi";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

const queryClient = new QueryClient();

const BrandManagementContent = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  const {
    data: brands,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const createBrandMutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries(["brands"]);
      closeModal();
      setSnackbar({
        open: true,
        message: "Brand created successfully!",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }) => updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["brands"]);
      closeModal();
      setSnackbar({
        open: true,
        message: "Brand updated successfully!",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries(["brands"]);
      setSnackbar({
        open: true,
        message: "Brand deleted successfully!",
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    },
  });

  const openModal = (brand = null) => {
    setEditingBrand(brand);
    if (brand) {
      setValue("name", brand.name);
    } else {
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingBrand(null);
    reset();
    setIsModalOpen(false);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.logo && data.logo[0]) {
      formData.append("logo", data.logo[0]);
    }

    if (editingBrand) {
      updateBrandMutation.mutate({ id: editingBrand._id, data: formData });
    } else {
      createBrandMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  const confirmDelete = () => {
    deleteBrandMutation.mutate(deleteConfirmation.id);
    setDeleteConfirmation({ open: false, id: null });
  };

  const columns = [
    {
      name: "Logo",
      cell: (row) => (
        <img
          src={`/uploads/${row.logo}`}
          alt={row.name}
          className="w-16 h-16 object-contain"
        />
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Slug",
      selector: (row) => row.slug,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openModal(row)}
            style={{ marginRight: "8px" }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Brand Management
      </h1>
      <div className="mb-4">
        <Button variant="contained" color="primary" onClick={() => openModal()}>
          Add Brand
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={brands || []}
        progressPending={isLoading}
        pagination
      />

      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>{editingBrand ? "Edit Brand" : "Add Brand"}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Brand Name"
              type="text"
              fullWidth
              variant="standard"
              {...register("name", { required: true })}
            />
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              {...register("logo")}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" className="mt-4">
                Upload Logo
              </Button>
            </label>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit">{editingBrand ? "Update" : "Create"}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteConfirmation.open}
        onClose={() => setDeleteConfirmation({ open: false, id: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this brand?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmation({ open: false, id: null })}
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const BrandManagement = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrandManagementContent />
    </QueryClientProvider>
  );
};

export default BrandManagement;
