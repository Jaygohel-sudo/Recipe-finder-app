import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import { useParams } from "react-router-dom";
import Search from "./Search";
import { useNavigate } from "react-router-dom";

const SearchResult = () => {
  const { keyword } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(keyword || "");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!keyword) return;
      try {
        setLoading(true);
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`
        );
        const data = await res.json();
        setRecipes(data.meals || []);
      } catch (err) {
        console.error(err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [keyword]); // runs every time the keyword in the URL changes

  const hasResults = recipes.length > 0 || loading;

  return (
    <div
      className={`min-h-screen transition-all duration-700 ease-in-out 
        flex flex-col items-center text-white px-6
        ${hasResults ? "justify-start pt-10" : "justify-center"}
      `}
    >
      <div
        className={`w-full max-w-md mb-8 transition-all duration-700 ease-in-out 
          ${hasResults ? "translate-y-0" : "translate-y-1/3"}
        `}
      >
        <Search />
      </div>

      <h2 className="text-3xl text-white font-bold mb-6">
        Search results for: <span className="text-green-400">{keyword}</span>
      </h2>

      {loading ? (
        <p className="text-white text-lg">Loading...</p>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {recipes.map((meal, index) => (
            <RecipeCard recipe={meal} key={index} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-lg">
          No recipes found for "{keyword}".
        </p>
      )}
    </div>
  );
};

export default SearchResult;
