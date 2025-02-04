import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import API_BASE_URL from "./config";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

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

  // Redirect to Add Book Page
  const handleAddBook = () => {
    navigate("/add"); // Use navigate to go to the add book page
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
                    onClick={() => handleDelet
