import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

const ProductReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiURL = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchReviews = async () => {
    if (!token) {
      setError("Not authorized. No token found.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}/reviews`, getAuthConfig());
      setReviews(response.data.reviews);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch reviews.");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${apiURL}/reviews/${id}`,
        { status: "approved" },
        getAuthConfig(),
      );
      fetchReviews(); // Refresh reviews after approval
    } catch (err) {
      setError("Failed to approve review.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiURL}/reviews/${id}`, getAuthConfig());
      fetchReviews(); // Refresh reviews after deletion
    } catch (err) {
      setError("Failed to delete review.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Product Reviews
      </h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review._id}>
                <TableCell>{review.productId?.name || "N/A"}</TableCell>
                <TableCell>{review.userId?.fullName || "N/A"}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>{review.status}</TableCell>
                <TableCell>
                  {review.status === "pending" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleApprove(review._id)}
                      style={{ marginRight: "10px" }}
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(review._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProductReview;
