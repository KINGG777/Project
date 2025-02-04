import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "./config";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books from the database
  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/books`);
        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Something went wrong. Please try again later.");
        setLoading(false);
      }
    };
    fetchAllBooks();
  }, []);

  // Handle book deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/books/${id}`);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
      setError("Failed to delete the book. Please try again.");
    }
  };

  // Adding new book
  const handleAddBook = () => {
    window.location.href = "/add"; // Redirect to add new book page
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Loading books...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <h2>{error}</h2>
        <Link to="/add" style={styles.addLink}>
          Add New Book
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>DevOps Project</h1>
        <p style={styles.creator}>Created by KINGG</p> {/* Added creator name */}
      </header>

      <button onClick={handleAddBook} style={styles.addBookButton}>
        Add New Book
      </button>

      {books.length === 0 ? (
        <div style={styles.noBooks}>
          <h2>No books found. Start adding some!</h2>
        </div>
      ) : (
        <div style={styles.gridContainer}>
          {books.map((book) => (
            <div key={book.id} style={styles.card}>
              <div style={styles.cardContent}>
                <img src={book.cover} alt={book.title} style={styles.image} />
                <h2 style={styles.bookTitle}>{book.title}</h2>
                <p style={styles.bookDesc}>{book.desc}</p>
                <span style={styles.bookPrice}>Price: ${book.price}</span>
                <div style={styles.buttonContainer}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    backgroundColor: "#2d2d2d",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    textAlign: "center",
  },
  title: {
    fontSize: "36px",
    margin: 0,
  },
  creator: {
    fontSize: "14px",
    color: "#ffcc00", // Highlighting the creator name
    marginTop: "5px",
  },
  addBookButton: {
    display: "block",
    width: "200px",
    margin: "20px auto",
    padding: "10px",
    backgroundColor: "#ff5722",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  cardContent: {
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "5px",
  },
  bookTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "10px 0",
  },
  bookDesc: {
    fontSize: "16px",
    color: "#555",
  },
  bookPrice: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "10px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  updateButton: {
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
  loading: {
    textAlign: "center",
    marginTop: "50px",
  },
  error: {
    textAlign: "center",
    marginTop: "50px",
    color: "red",
  },
  noBooks: {
    textAlign: "center",
    marginTop: "50px",
  },
};

export default Books;
