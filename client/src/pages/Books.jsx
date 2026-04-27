import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "./config";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/books`);

        console.log("API RESPONSE:", response.data);

        // ✅ FIX: always ensure array
        const booksData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        setBooks(booksData);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Backend/API not reachable");
      } finally {
        setLoading(false);
      }
    };

    fetchAllBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/books/${id}`);
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== id)
      );
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Loading books...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>DevOps Project KINGG</h1>

      {/* ✅ SAFE RENDER */}
      {Array.isArray(books) && books.length > 0 ? (
        <div style={{ display: "grid", gap: "20px" }}>
          {books.map((book) => (
            <div key={book.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
              <img src={book.cover} alt={book.title} style={{ width: "100%" }} />
              <h2>{book.title}</h2>
              <p>{book.desc}</p>
              <span>${book.price}</span>

              <div>
                <button onClick={() => handleDelete(book.id)}>Delete</button>
                <Link to={`/update/${book.id}`} style={{ marginLeft: "10px" }}>
                  Update
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h2 style={{ textAlign: "center" }}>No books found</h2>
      )}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/add">Add New Book</Link>
      </div>
    </div>
  );
};

export default Books;
