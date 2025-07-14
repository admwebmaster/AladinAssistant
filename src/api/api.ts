import axios from 'axios';

const API_BASE_URL = 'https://gateway.teamupservice.com/api/v2';

// API timeout (10 seconds)
const API_TIMEOUT = 10000;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Token will be added by the AuthContext when available
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'Errore del server';
      throw new Error(message);
    } else if (error.request) {
      // Network error
      throw new Error('Errore di connessione. Verifica la tua connessione internet.');
    } else {
      // Other error
      throw new Error('Errore imprevisto. Riprova più tardi.');
    }
  }
);

// Types
export interface RegisterData {
  nome: string;
  cognome: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  nome: string;
  cognome: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
  token: string;
}

export interface Quote {
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

// API functions
export const authAPI = {
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await apiClient.post('/users/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post('/users/login', data);
    return response.data;
  },
};

export const quotesAPI = {
  getQuotes: async (token: string): Promise<Quote[]> => {
    const response = await apiClient.get('/preventivi', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default apiClient;