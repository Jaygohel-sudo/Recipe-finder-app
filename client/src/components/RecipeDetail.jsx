import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Search from "./Search";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
const RecipeDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState("");
  const [saved, setSaved] = useState(false);

  const { user } = useAuthStore();
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/auth"
      : "/api/auth";

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await response.json();
        setRecipe(data.meals[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [id]);
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user?._id || !recipe?.idMeal) return;
      try {
        const res = await axios.get(`${API_URL}/saved-recipes/${user._id}`);
        const savedIds = res.data.savedRecipes.map((item) => item.recipeId);
        setSaved(savedIds.includes(recipe.idMeal));
      } catch (err) {
        console.error("Error checking saved recipe:", err);
      }
    };
    checkIfSaved();
  }, [user, recipe]);

  const handleSave = async () => {
    try {
      if (!saved) {
        await axios.post(`${API_URL}/recipes/save`, {
          userId: user._id,
          recipeId: recipe.idMeal,
        });
        setSaved(true);
      } else {
        await axios.post(`${API_URL}/recipes/unsave`, {
          userId: user._id,
          recipeId: recipe.idMeal,
        });
        setSaved(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;
  return (
    <div
      className={`min-h-screen transition-all duration-700 ease-in-out 
        flex flex-col items-center text-white px-6 justify-start pt-10`}
    >
      <div className="mb-8 transition-all ">
        <Search />
      </div>
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="size-64 rounded-xl mb-6"
      />
      {/* Category & Area */}
      <p className="text-gray-400 mb-4">
        {recipe.strCategory} - {recipe.strArea}
      </p>
      {/* Recipe name */}
      <h1 className="text-3xl font-bold mb-4">{recipe.strMeal}</h1>
      {/* Instructions */}
      <div className="w-full max-w-3xl mx-auto mt-6 bg-gray-900 p-8 rounded-xl shadow-lg">
        {recipe.strInstructions && (
          <ul className="list-disc list-inside text-gray-200 leading-relaxed ">
            {recipe.strInstructions
              .split("\n") // split by line breaks
              .filter((line) => line.trim() !== "") // remove empty lines
              .map((line, index) => (
                <li key={index}>{line}</li>
              ))}
          </ul>
        )}
      </div>
      <div className="fixed right-10 bottom-10 ">
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg text-white font-medium transition ${
            saved
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {saved ? "Unsave Recipe" : "Save Recipe"}
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
