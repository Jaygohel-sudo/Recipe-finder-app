import React, { useState } from "react";
import { Home, LogOut, Menu, Heart } from "lucide-react"; // optional icons
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Navbar = ({ collapsed, toggleCollapse }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSavedRecipes = async (e) => {
    e.preventDefault();
    navigate("/saved-recipes");
  };

  const handleHome = async (e) => {
    e.preventDefault();
    try {
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className={`h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-15" : "w-64"
      }`}
    >
      {/* Top section */}
      <div
        className={`flex items-center p-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <h1
          className={`text-2xl font-bold transition-all duration-300 ${
            collapsed ? "opacity-0 hidden" : "opacity-100 "
          }`}
        >
          Recipe
        </h1>
        <button
          onClick={toggleCollapse}
          className={`p-2 rounded-md hover:bg-gray-800 transition `}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 mt-6">
        <ul className="space-y-2">
          <li
            onClick={handleHome}
            className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition"
          >
            <Home size={22} />
            {!collapsed && <span>Home</span>}
          </li>
          <li
            onClick={handleSavedRecipes}
            className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition"
          >
            <Heart size={22} />
            {!collapsed && <span>Saved Recipes</span>}
          </li>
        </ul>
      </nav>

      {/* Bottom section */}
      <button onClick={handleLogout}>
        <div className="p-4 mt-auto flex items-center gap-3 hover:bg-gray-800 cursor-pointer">
          <LogOut size={22} />
          {!collapsed && <span>Logout</span>}
        </div>
      </button>
    </div>
  );
};

export default Navbar;
