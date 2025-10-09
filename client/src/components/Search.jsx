import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleOnClick = (e) => {
    e.preventDefault();
    navigate(`/search/${query}`);
  };

  return (
    <div>
      <div className="max-w-md w-full bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-xl shadow-xl overflow-hidden  py-4 px-4 text-xl text-white">
        <input
          className="focus:outline-none"
          id="recipe"
          type="text"
          placeholder="Type recipe name..."
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <button
          onClick={handleOnClick}
          className=" hover:cursor-pointer  py-3 px-4 bg-gradient-to-r from-blue-500 to-emerald-600 text-white text-xl font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-0 focus:ring-green-100 focus:ring-offset-4 focus:ring-offset-gray-900 transition duration-200"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
