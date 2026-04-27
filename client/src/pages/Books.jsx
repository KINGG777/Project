import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "./config";

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/books`);

        console.log("API RESPONSE:", res.data); // ✅ debug

        // ✅ FIX: ensure always array
        const booksData = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        setBooks(booksData);
      } catch (err) {
        console.log("API ERROR:", err);
      }
    };
    fetchAllBooks();
  }, []);

  console.log(books);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/books/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Welcomt to MultiCloud with DevSecOps Training by VEERA Nareshit 6 months </h1>

      <div className="books">
        {/* ✅ FIX: prevent crash */}
        {Array.isArray(books) &&
          books.map((book) => (
            <div key={book.id} className="book">
              <img src={book.cover} alt="" />
              <h2>{book.title}</h2>
              <p>{book.desc}</p>
              <span>${book.price}</span>

              <button className="delete" onClick={() => handleDelete(book.id)}>
                Delete
              </button>

              <button className="update">
                <Link
                  to={`/update/${book.id}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Update
                </Link>
              </button>
            </div>
          ))}
      </div>

      <button className="addHome">
        <Link to="/add" style={{ color: "inherit", textDecoration: "none" }}>
          Add new book
        </Link>
      </button>
    </div>
  );
};

export default Books;
