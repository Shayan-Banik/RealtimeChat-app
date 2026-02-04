/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "@/lib/axios.client";
import type { LoginType, RegisterType, UserType } from "@/types/auth.types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSocket } from "./use-socket";

interface AuthState {
  user: UserType | null;
  isLoggedIn: boolean;
  isSignUp: boolean;
  isAuthStatusLoading: boolean;

  register: (data: RegisterType) => void;
  login: (data: LoginType) => void;
  logout: () => void;
  isAuthStatus: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isSignUp: false,
      isAuthStatusLoading: false,

      register: async (data: RegisterType) => {
        set({ isSignUp: true });
        try {
          const response = await API.post("/auth/register", data);
           console.log("Registration response:", response.data);
          set({ user: response.data.data});
          useSocket.getState().connectSocket();
          toast.success("Registration successful");
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Registration Failed");
        } finally {
          set({ isSignUp: false });
        }
      },
      login: async (data: LoginType) => {
        set({ isLoggedIn: true });
        try {
          const response = await API.post("/auth/login", data);
          set({ user: response.data.data, isLoggedIn: true });
          useSocket.getState().connectSocket();
          toast.success("Login successful");
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Login Failed");
        } finally {
          set({ isLoggedIn: true });
        }
      },
      logout: async () => {
        try {
          await API.post("/auth/logout");
          set({ user: null });
          useSocket.getState().disconnectSocket();
          toast.success("Logout successfully");
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Logout successfully");
        }
      },
      isAuthStatus: async () => {
        set({isAuthStatusLoading: true});
        try {
          const response = await API.get("/auth/status");
          set({ user: response.data.user });
          useSocket.getState().connectSocket();
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Authentication Failed");
        } finally {
          set({isAuthStatusLoading: false});
        }
      },
    }),
    {
      name: "whop:root",
    },
  ),
);



