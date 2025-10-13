import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "./Input";
import { Lock, Loader } from "lucide-react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { resetPassword, error, isLoading, message } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await resetPassword(token, password);
    toast.success("Password reset successful, redirecting to login page...");
    if (!error) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blue-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-emerald-500 text-transparent bg-clip-text">
          Reset Password
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <Input
            icon={Lock}
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
            pattern={passwordRegex}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            required
            pattern={passwordRegex}
          />
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-emerald-600 text-white text-xl font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-3 focus:ring-green-100 focus:ring-offset-4 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
