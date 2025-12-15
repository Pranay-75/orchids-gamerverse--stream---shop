"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Loader2, Zap } from "lucide-react";
import { signIn, signUp } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!username.trim()) {
          throw new Error("Username is required");
        }
        await signUp(email, password, username);
        setError("Account created! Please check your email to verify your account.");
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setError("");
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0a0a0f]/90 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-[#12121a] rounded-2xl p-8 neon-border"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#1a1a25] transition-colors"
          >
            <X className="w-5 h-5 text-[#8888a0]" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#ff00aa] flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#0a0a0f]" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-2xl text-[#00f0ff]">
                {mode === "login" ? "Welcome Back" : "Join the Arena"}
              </h2>
              <p className="text-sm text-[#8888a0] font-rajdhani">
                {mode === "login" ? "Sign in to continue" : "Create your account"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-rajdhani font-semibold text-[#8888a0] mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8888a0]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#1a1a25] border border-[#00f0ff]/20 rounded-lg pl-10 pr-4 py-3 text-[#f0f0f5] font-rajdhani focus:outline-none focus:border-[#00f0ff] transition-colors"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-rajdhani font-semibold text-[#8888a0] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8888a0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a25] border border-[#00f0ff]/20 rounded-lg pl-10 pr-4 py-3 text-[#f0f0f5] font-rajdhani focus:outline-none focus:border-[#00f0ff] transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-rajdhani font-semibold text-[#8888a0] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8888a0]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1a25] border border-[#00f0ff]/20 rounded-lg pl-10 pr-4 py-3 text-[#f0f0f5] font-rajdhani focus:outline-none focus:border-[#00f0ff] transition-colors"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div
                className={`p-3 rounded-lg text-sm font-rajdhani ${
                  error.includes("created")
                    ? "bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14]"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00f0ff] to-[#9945ff] font-orbitron font-bold text-[#0a0a0f] hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#8888a0] font-rajdhani">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={switchMode}
                className="ml-2 text-[#00f0ff] font-semibold hover:underline"
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
