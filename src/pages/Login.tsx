import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, Shield, LineChart, Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import authService from "@/lib/authService";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get the return path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  // Define form schema with Zod
  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Login directly with email and password using the AuthContext login function
      const success = await login(values.email, values.password);

      if (success) {
        // Navigate to the return path
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Toast is already handled by the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Login Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-forex-dark">
              Welcome Back
            </h1>
            <p className="mt-2 text-forex-neutral">
              Sign in to your TradeChampionX account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <Button
                type="submit"
                className="w-full bg-forex-primary hover:bg-forex-primary-dark"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-forex-neutral">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-forex-primary hover:text-forex-primary-dark">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Image/Feature Side */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-forex-primary to-forex-dark items-center justify-center p-10">
        <div className="max-w-lg text-white space-y-12">
          <h2 className="text-3xl font-bold">Trade. Compete. Win.</h2>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <Shield className="h-8 w-8 text-white/90 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Secure Trading</h3>
                <p className="mt-1 text-white/80">
                  Your account is protected with the highest security standards in the industry
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <LineChart className="h-8 w-8 text-white/90 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Real-Time Analytics</h3>
                <p className="mt-1 text-white/80">
                  Track your performance with advanced trading metrics and leaderboards
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Lock className="h-8 w-8 text-white/90 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Instant Payouts</h3>
                <p className="mt-1 text-white/80">
                  Receive your winnings directly to your crypto wallet with no delays
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;