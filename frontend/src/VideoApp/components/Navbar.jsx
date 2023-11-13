import React, { useState } from "react";
import "../assets/style/Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/search?q=" + searchText);
  };
  return (
    <div className="navContainer">
      <div className="search">
        <input
          type="search"
          name="searchInput"
          id="searchInput"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Looking for any video?"
        />
        <i onClick={handleSearch} className="fa-solid fa-magnifying-glass"></i>
      </div>
    </div>
  );
};

export default Navbar;
