import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import RecipeCard from "./RecipeCard";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

const SavedRecipe = () => {
  const { user } = useAuthStore();
  const [savedRecipe, setSavedRecipe] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(`${API_URL}/saved-recipes/${user._id}`);
        const ids = res.data.savedRecipes;
        console.log(ids);
        const meals = await Promise.all(
          ids.map(async (id) => {
            const r = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id.recipeId}`
            );
            const d = await r.json();
            return d.meals ? d.meals[0] : null;
          })
        );

        setSavedRecipe(meals.filter(Boolean));
        console.log(meals);
      } catch (error) {}
    };
    fetchRecipes();
  }, [user._id]);

  return (
    <div>
      {savedRecipe.map((meals, index) => {
        return <RecipeCard recipe={meals} key={index} />;
      })}
    </div>
  );
};

export default SavedRecipe;
