import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "./config";

const Books = () => {
  const [books, setBooks] = useState([]);

  // Fetch all books from the backend
  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/books`);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchAllBooks();
  }, []);

  // Delete a book
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/books/${id}`);
      // Remove the book from the UI without reloading
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}> KINGG </h1>
      <div style={styles.gridContainer}>
        {books.map((book) => (
          <div key={book.id} style={styles.card}>
            <img src={book.cover} alt={book.title} style={styles.image} />
            <h2 style={styles.title}>{book.title}</h2>
            <p style={styles.description}>{book.desc}</p>
            <span style={styles.price}>Price: ${book.price}</span>
            <div style={styles.actions}>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(book.id)}
              >
                Delete
              </button>
              <button style={styles.updateButton}>
                <Link to={`/update/${book.id}`} style={styles.link}>
                  Update
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.addContainer}>
        <Link to="/add" style={styles.addLink}>
          Add New Book
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#f4f4f9",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "20px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    textAlign: "center",
    padding: "15px",
    transition: "transform 0.3s",
  },
  cardHover: {
    transform: "scale(1.05)",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  title: {
    fontSize: "1.5rem",
    margin: "10px 0",
    color: "#444",
  },
  description: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "10px",
  },
  price: {
    fontSize: "1rem",
    color: "#28a745",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  updateButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  link: {
    color: "inherit",
    textDecoration: "none",
  },
  addContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  addLink: {
    backgroundColor: "#17a2b8",
    color: "#fff",
    padding: "12px 20px",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "1.2rem",
  },
};

export default Books;
