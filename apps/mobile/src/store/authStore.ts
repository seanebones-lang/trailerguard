import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { supabase } from "../lib/supabase";

type AuthActionResult = {
  success: boolean;
  errorMessage: string;
};

type AuthState = {
  session: Session | null;
  setSession: (session: Session | null) => void;
  signInWithPassword: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  signInWithPassword: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, errorMessage: error.message };
    }
    return { success: true, errorMessage: "" };
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
}));

export function useBootstrapAuth() {
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setIsBootstrapped(true);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [setSession]);

  return isBootstrapped;
}
