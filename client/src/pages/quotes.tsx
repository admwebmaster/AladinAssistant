import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { File, Plus, Eye, Trash2, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/auth";
import { useLocation } from "wouter";

interface Quote {
  id: number;
  cliente_id?: number;
  utente_api_id: number;
  nome: string;
  cognome: string;
  data_nascita?: string;
  codice_fiscale?: string;
  indirizzo?: string;
  numero_telefono?: string;
  email?: string;
  occupazione?: string;
  reddito_mensile?: string;
  importo_richiesto: string;
  numero_rate: number;
  rata_mensile: string;
  finalita?: string;
  stato: string;
  created_at: string;
  updated_at: string;
}

export default function Quotes() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Accesso richiesto",
        description: "Devi effettuare l'accesso per visualizzare i preventivi.",
        variant: "destructive",
      });
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, toast, setLocation]);

  const {
    data: quotes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/quotes"],
    queryFn: authApi.getQuotes,
    enabled: isAuthenticated,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes("Authentication expired")) {
        toast({
          title: "Sessione scaduta",
          description: "Effettua nuovamente l'accesso.",
          variant: "destructive",
        });
        setLocation("/login");
        return false;
      }
      return failureCount < 3;
    },
  });

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT");
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      "In attesa": {
        variant: "secondary" as const,
        className:
          "bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-1",
      },
      Approvato: {
        variant: "secondary" as const,
        className:
          "bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1",
      },
      Rifiutato: {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-700 border-red-200 text-xs px-2 py-1",
      },
    };

    const config =
      statusMap[status as keyof typeof statusMap] || statusMap["In attesa"];

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const handleLogout = () => {
    authApi.logout();
    toast({
      title: "Disconnesso",
      description: "Sei stato disconnesso con successo.",
    });
    setLocation("/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <File className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Errore nel caricamento
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              {error instanceof Error
                ? error.message
                : "Si è verificato un errore imprevisto"}
            </p>
            <Button onClick={handleLogout} variant="outline">
              Torna al login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 primary-gradient rounded-full flex items-center justify-center shadow-sm">
              <File className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-semibold text-primary">
              Richieste Prestiti
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-gray-600"
            >
              Esci
            </Button>
            <Button
              size="sm"
              className="primary-gradient hover:primary-gradient-hover shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      <div className="p-4 space-y-3 pb-20">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((__, index) => (
            <Card key={index} className="shadow-sm border border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : quotes && quotes.length > 0 ? (
          quotes.map((quote: Quote) => (
            <Card
              key={quote.id}
              className="shadow-sm border border-gray-100 bg-white rounded-lg"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {quote.nome} {quote.cognome}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Richiesta: {formatDate(quote.created_at)}
                    </p>
                    <div className="mt-2">{getStatusBadge(quote.stato)}</div>
                  </div>
                  <div className="flex space-x-2 ml-3">
                    <Button
                      size="sm"
                      className="w-8 h-8 p-0 primary-gradient rounded-full shadow-sm"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0 rounded-full border-red-200 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Importo:</span>
                    <span className="text-base font-semibold text-primary">
                      {formatCurrency(quote.importo_richiesto)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rate:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {quote.numero_rate} mesi
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rata mensile:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(quote.rata_mensile)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-8 text-center">
              <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nessun preventivo trovato
              </h3>
              <p className="text-gray-500 text-sm">
                Non ci sono ancora richieste di prestito da visualizzare.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex justify-center space-x-16">
          <button className="flex flex-col items-center space-y-1">
            <MessageCircle className="text-gray-400 w-6 h-6" />
            <span className="text-xs text-gray-500">Chat</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-8 h-8 primary-gradient rounded-full flex items-center justify-center">
              <File className="text-white w-5 h-5" />
            </div>
            <span className="text-xs text-primary font-medium">Prestiti</span>
          </button>
        </div>
      </div>
    </div>
  );
}
