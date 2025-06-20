const TOKEN_KEY = 'aladin_auth_token';
const USER_KEY = 'aladin_user_data';

export const tokenStorage = {
  get: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const userStorage = {
  get: (): any | null => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
  
  set: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const createAuthHeaders = (token?: string) => {
  const authToken = token || tokenStorage.get();
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch('https://gateway.teamupservice.com/api/v2/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.token) {
      tokenStorage.set(data.token);
      userStorage.set(data.user);
    }
    
    return data;
  },

  register: async (nome: string, cognome: string, email: string, password: string) => {
    const response = await fetch('https://gateway.teamupservice.com/api/v2/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, cognome, email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Registration failed: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.token) {
      tokenStorage.set(data.token);
      // For registration, we need to store user data based on what we sent
      userStorage.set({ nome, cognome, email });
    }
    
    return data;
  },

  getQuotes: async () => {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('https://gateway.teamupservice.com/api/v2/preventivi', {
      method: 'GET',
      headers: {
        ...createAuthHeaders(token),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        tokenStorage.remove();
        throw new Error('Authentication expired');
      }
      const errorText = await response.text();
      throw new Error(`Failed to fetch quotes: ${errorText}`);
    }

    return await response.json();
  },

  logout: () => {
    tokenStorage.remove();
  }
};
