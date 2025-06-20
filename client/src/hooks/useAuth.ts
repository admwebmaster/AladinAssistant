import { useQuery } from "@tanstack/react-query";
import { tokenStorage, userStorage } from "@/lib/auth";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: () => {
      const token = tokenStorage.get();
      const userData = userStorage.get();
      
      if (!token || !userData) {
        return null;
      }
      
      return userData;
    },
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!tokenStorage.get(),
  };
}
