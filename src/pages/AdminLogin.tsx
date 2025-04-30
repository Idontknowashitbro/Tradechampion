import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Lock, LogIn, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import api from "@/lib/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in as admin, redirect to admin page
  if (isAuthenticated && user?.role === "admin") {
    navigate("/admin");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check if email is admin@example.com
      if (formData.email !== "admin@example.com") {
        setError("This login page is for administrators only.");
        setIsLoading(false);
        return;
      }

      // Use the login function from auth context
      const success = await login(formData.email, formData.password);

      if (success) {
        // Check if user is admin after login
        if (user?.role !== "admin") {
          setError("You do not have administrator privileges.");
          return;
        }

        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel."
        });

        // Redirect to admin page
        navigate("/admin");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-forex-dark">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
        <Card className="w-full max-w-md bg-forex-card/30 border-forex-border/20">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-12 w-12 text-forex-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white">Admin Login</CardTitle>
            <CardDescription className="text-center text-white/60">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-forex-dark/60 border-forex-border/20 text-white pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                    <Shield className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-forex-dark/60 border-forex-border/20 text-white pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-forex-primary hover:bg-forex-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Logging in</span>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login to Admin Panel
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-white/60 text-sm">
              This page is for administrators only.
            </div>
            <div className="text-center flex flex-col space-y-2">
              <Button
                variant="link"
                className="text-forex-primary"
                onClick={() => navigate("/")}
              >
                Return to Homepage
              </Button>
              <Button
                variant="link"
                className="text-forex-primary"
                onClick={() => navigate("/admin")}
              >
                Go to Admin Panel Directly
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
