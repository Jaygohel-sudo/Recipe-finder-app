import React from "react";
import { Link, useParams } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const { keyword } = useParams();
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <Link to={`/search/${keyword}/${recipe.idMeal}`}>
        <div>
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              {recipe.strMeal}
            </h2>
          </div>
        </div>
      </Link>
      <a
        href={recipe.strYoutube}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline p-4"
      >
        Watch Tutorial
      </a>
    </div>
  );
};

export default RecipeCard;
