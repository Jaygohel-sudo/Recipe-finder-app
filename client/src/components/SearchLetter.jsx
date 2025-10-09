import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import RecipeCard from "./RecipeCard";

const SearchLetter = () => {
  const [recipes, setRecipes] = useState([]);
  const { letter } = useParams();
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
        );
        const data = await res.json();
        setRecipes(data.meals || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecipes();
  }, [letter]);

  return (
    <div
      className="min-h-screen transition-all duration-700 ease-in-out 
        flex flex-col items-center text-white px-6 justify-start pt-10
     "
    >
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {letters.map((letter) => (
          <Link
            key={letter}
            to={`/letter/${letter}`} // each letter links to route
            className="w-10 h-10 flex items-center justify-center 
                     bg-emerald-600 hover:bg-emerald-700 text-white 
                     font-bold rounded-full shadow-md transition-all duration-200"
          >
            {letter}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl">
        {recipes.map((meal, index) => (
          <RecipeCard recipe={meal} key={index} />
        ))}
      </div>
    </div>
  );
};

export default SearchLetter;
