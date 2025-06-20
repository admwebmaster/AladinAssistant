import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginData } from "@shared/schema";
import { authApi } from "@/lib/auth";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginData) => authApi.login(email, password),
    onSuccess: () => {
      toast({
        title: "Accesso effettuato",
        description: "Benvenuto in Aladin IA Assistant!",
      });
      setLocation("/quotes");
    },
    onError: (error: Error) => {
      toast({
        title: "Errore di accesso",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-sm shadow-lg">
        <CardContent className="p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 primary-gradient rounded-full flex items-center justify-center shadow-lg">
              <Lightbulb className="text-white text-2xl w-8 h-8" />
            </div>
          </div>
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-primary mb-2">Aladin IA Assistant</h1>
            <p className="text-gray-600 text-sm">Accedi per iniziare la tua esperienza</p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@esempio.com"
                className="mt-2 px-4 py-3 border-gray-200 rounded-xl focus:ring-primary focus:border-primary"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            
            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-gray-700 text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-2 px-4 py-3 border-gray-200 rounded-xl focus:ring-primary focus:border-primary"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            
            {/* Login Button */}
            <Button 
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full primary-gradient hover:primary-gradient-hover text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg mt-6"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accesso in corso...
                </>
              ) : (
                "Accedi"
              )}
            </Button>
          </form>
          
          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Non hai un account?{" "}
              <button 
                onClick={() => setLocation("/register")}
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Registrati
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
