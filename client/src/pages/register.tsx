import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { registerSchema, type RegisterData } from "@shared/schema";
import { authApi } from "@/lib/auth";
import { useLocation } from "wouter";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      cognome: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ nome, cognome, email, password }: RegisterData) => 
      authApi.register(nome, cognome || "", email, password),
    onSuccess: () => {
      toast({
        title: "Registrazione completata",
        description: "Il tuo account è stato creato con successo!",
      });
      setLocation("/quotes");
    },
    onError: (error: Error) => {
      toast({
        title: "Errore di registrazione",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-sm shadow-lg">
        <CardContent className="p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 primary-gradient rounded-full flex items-center justify-center shadow-lg">
              <UserPlus className="text-white text-2xl w-8 h-8" />
            </div>
          </div>
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-primary mb-2">Crea un account</h1>
            <p className="text-gray-600 text-sm">Registrati per accedere a tutte le funzionalità</p>
          </div>
          
          {/* Register Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome Field */}
            <div>
              <Label htmlFor="nome" className="text-gray-700 text-sm font-medium">
                Nome
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder="Il tuo nome"
                className="mt-2 px-4 py-3 border-gray-200 rounded-xl focus:ring-primary focus:border-primary"
                {...form.register("nome")}
              />
              {form.formState.errors.nome && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>

            {/* Cognome Field */}
            <div>
              <Label htmlFor="cognome" className="text-gray-700 text-sm font-medium">
                Cognome
              </Label>
              <Input
                id="cognome"
                type="text"
                placeholder="Il tuo cognome (opzionale)"
                className="mt-2 px-4 py-3 border-gray-200 rounded-xl focus:ring-primary focus:border-primary"
                {...form.register("cognome")}
              />
            </div>
            
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
            
            {/* Register Button */}
            <Button 
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full primary-gradient hover:primary-gradient-hover text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg mt-6"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrazione in corso...
                </>
              ) : (
                "Registrati"
              )}
            </Button>
          </form>
          
          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Hai già un account?{" "}
              <button 
                onClick={() => setLocation("/login")}
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Accedi
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
