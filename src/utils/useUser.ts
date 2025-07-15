// hooks/useUser.ts
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

// Custom hook to get user info from Supabase
export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    fetchUser();
  }, [supabase]);

  return user;
};
