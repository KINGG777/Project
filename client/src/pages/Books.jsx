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
        <h1 style={styles.title}>Book Management System</h1>
      </header>

      {books.length === 0 ? (
        <div style={styles.noBooks}>
          <h2>No books found. Start adding some!</h2>
          <Link to="/add" style={styles.addLink}>
            Add New Book
          </Link>
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

      {/* Add Book Button */}
      <div style={styles.addBookButtonContainer}>
        <Link to="/add" style={styles.addBookButton}>
          Add New Book
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "2rem",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  cardContent: {
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  bookTitle: {
    fontSize: "1.2rem",
    margin: "10px 0",
  },
  bookDesc: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "10px",
  },
  bookPrice: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: "10px",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  updateButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  link: {
    textDecoration: "none",
    color: "#fff",
  },
  addLink: {
    color: "#3498db",
    textDecoration: "none",
  },
  noBooks: {
    textAlign: "center",
  },
  addBookButtonContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  addBookButton: {
    backgroundColor: "#2ecc71",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
  },
  loading: {
    textAlign: "center",
  },
  error: {
    textAlign: "center",
    color: "red",
  },
};

export default Books;
