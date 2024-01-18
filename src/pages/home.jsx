import React, { useState } from "react";
import "./home.css";
import Navbar from "../components/navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default () => {
  return (
    <>
      <div className="container">
        <div className="nav">
          <Navbar />
        </div>
        <div className="main-panel">
          <div class="search-bar">
            <input
              type="text"
              class="search-input"
              placeholder="Search venue..."
            />
            <button class="search-button">
              <FaSearch />
            </button>
          </div>
          <h1> My Favorites </h1>
          <table className="table">
            <tr>
              <th>Name</th>
              <th>Date Added</th>
            </tr>
            <tr>
              <td>HKUST Fusion</td>
              <td>Sept 20, 2023</td>
            </tr>
            <tr>
              <td>Central Plaza</td>
              <td>Sept 20, 2023</td>
            </tr>
            <tr>
              <td>Venue 3</td>
              <td>Sept 20, 2023</td>
            </tr>
            <tr>
              <td>Venue 4</td>
              <td>Sept 20, 2023</td>
            </tr>
            <tr>
              <td>Venue 5</td>
              <td>Sept 20, 2023</td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};
