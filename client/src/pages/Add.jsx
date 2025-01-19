import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./config";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [cover, setCover] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const newBook = { title, desc, price, cover };
      await axios.post(`${API_BASE_URL}/books`, newBook);
      navigate("/"); // Redirect to the main page after adding the book
    } catch (err) {
      console.error("Error adding book:", err);
      setError("Failed to add the book. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add New Book</h1>
      <form style={styles.form} onSubmit={handleAddBook}>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Book Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={styles.textarea}
          required
        ></textarea>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Cover Image URL"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          Add Book
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "20px",
  },
  form: {
    maxWidth: "500px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  textarea: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
    height: "100px",
  },
  submitButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default AddBook;
