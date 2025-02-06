"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Loader, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { login } from "./action";
import { useUserStore } from "@/store/authStore";
import { toast } from "sonner";

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setUser } = useUserStore();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(formData);
      console.log("User logged in", user);

      setUser({
        id: user.user.id,
        name: user.user.name,
        email: user.user.email,
      });
      toast.success("Login successful. Welcome back!", { duration: 5000 , icon: "🎉" } );
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
    >
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800 dark:text-white backdrop-blur-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <CheckSquare className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold text-primary dark:text-white">
              TaskMaster
            </CardTitle>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Welcome back! Let&apos;s get productive.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              <Input
                name="email"
                placeholder="Email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10 border-primary/20 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              <Input
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-16 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-primary hover:underline focus:outline-none dark:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {error && (
              <p className="text-red-500 font-semibold mb-2">{error}</p>
            )}
            <Button
              className="w-full py-3 px-4 bg-primary dark:bg-primary-dark text-white"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/signup"
              className="text-primary dark:text-primary-light hover:underline font-medium"
            >
              Sign up here
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
