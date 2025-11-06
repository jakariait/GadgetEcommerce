import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Check, Block } from "@mui/icons-material";
import useAuthAdminStore from "../../store/AuthAdminStore.js";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

const ProductQuestions = () => {
  const { token } = useAuthAdminStore();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("/questions", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch questions");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOpenModal = (question) => {
    setSelectedQuestion(question);
    setAnswer(question.answer || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedQuestion(null);
    setAnswer("");
    setIsModalOpen(false);
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) return;

    try {
      const response = await axios.put(`/questions/${selectedQuestion._id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestions(
        questions.map((q) =>
          q._id === selectedQuestion._id ? response.data.updated : q,
        ),
      );
      handleCloseModal();
    } catch (err) {
      setError("Failed to submit answer");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(
        `/questions/${id}`,
        {
          status,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setQuestions(
        questions.map((q) => (q._id === id ? response.data.updated : q)),
      );
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/questions/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (err) {
      setError("Failed to delete question");
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className={"p-4 shadow-lg rounded-lg  mx-auto"}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold ">
        Product Questions
      </h1>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((q) => (
              <TableRow key={q._id}>
                <TableCell>{q.question}</TableCell>
                <TableCell>
                  {q.productId?.name || q.productId?.slug || q.productId}
                </TableCell>
                <TableCell>
                  {q.userId?.fullName ||
                    q.userId?.name ||
                    q.userId?.email ||
                    q.userId}
                </TableCell>
                <TableCell>{q.status}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenModal(q)}
                  >
                    <Edit />
                  </IconButton>
                  {q.status !== "answered" && (
                    <IconButton
                      color="success"
                      onClick={() => handleStatusChange(q._id, "answered")}
                    >
                      <Check />
                    </IconButton>
                  )}
                  {q.status !== "hidden" && (
                    <IconButton
                      color="warning"
                      onClick={() => handleStatusChange(q._id, "hidden")}
                    >
                      <Block />
                    </IconButton>
                  )}
                  <IconButton color="error" onClick={() => handleDelete(q._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth>
        <DialogTitle>Answer Question</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>Question:</strong> {selectedQuestion?.question}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Answer"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleAnswerSubmit} variant="contained">
            Submit Answer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductQuestions;
