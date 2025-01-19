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
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Book Management System</h1>
      </header>
      <div style={styles.gridContainer}>
        {books.map((book) => (
          <div
            key={book.id}
            style={styles.card}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform =
                "scale(1.05) perspective(1000px) rotateX(-3deg) rotateY(3deg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform =
                "scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)")
            }
          >
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
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f0f8ff",
    padding: "20px",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "700",
    color: "#333",
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
    transform: "scale(1) perspective(1000px) rotateX(0) rotateY(0)",
    transition: "transform 0.5s, box-shadow 0.5s",
    cursor: "pointer",
  },
  cardContent: {
    padding: "20px",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "15px",
    marginBottom: "15px",
  },
  bookTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#444",
    marginBottom: "10px",
  },
  bookDesc: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "15px",
  },
  bookPrice: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#28a745",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "15px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  updateButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  link: {
    color: "inherit",
    textDecoration: "none",
  },
  addContainer: {
    textAlign: "center",
    marginTop: "30px",
  },
  addLink: {
    backgroundColor: "#17a2b8",
    color: "#fff",
    padding: "12px 25px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "1.5rem",
    fontWeight: "600",
    boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.2)",
  },
};

export default Books;
