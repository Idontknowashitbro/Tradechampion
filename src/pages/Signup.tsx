import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, Users, Trophy, Zap } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import authService from "@/lib/authService";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Define form schema with Zod
  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    discordUsername: z.string().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      discordUsername: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Signup directly with the AuthContext signup function
      const success = await signup(values.name, values.email, values.password, values.discordUsername);

      if (success) {
        // Navigate to dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      // Toast is already handled by the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Signup Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-forex-dark">
              Create Your Account
            </h1>
            <p className="mt-2 text-forex-neutral">
              Join TradeChampionX and start your trading journey
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discordUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Username (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="username#1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-forex-primary hover:bg-forex-primary-dark"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-forex-neutral">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-forex-primary hover:text-forex-primary-dark">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Feature Side */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-forex-primary to-forex-dark items-center justify-center p-10">
        <div className="max-w-lg text-white space-y-12">
          <h2 className="text-3xl font-bold">Why Join TradeChampionX?</h2>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <Users className="h-8 w-8 text-white/90 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Community Driven</h3>
                <p className="mt-1 text-white/80">
                  Join a growing community of traders who compete, learn, and grow together
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Trophy className="h-8 w-8 text-white/90 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Daily Competitions</h3>
                <p className="mt-1 text-white/80">
                  Participate in daily, weekly, and monthly trading challenges with real prizes
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Zap className="h-8 w-8 text-white/90 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Fair & Transparent</h3>
                <p className="mt-1 text-white/80">
                  Our platform is built on transparency with clear rules and fair competition
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;