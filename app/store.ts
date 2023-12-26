import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

import axios from "axios";

interface User {
  name?: string;
  userName?: string;
  email?: string;
  avatar?: {
    src?: string;
    _id?: string;
  };
  id?: string;
  token?: string;
}

export const useStore = create(
  persist(
    (set: any) => ({
      user: {
        name: "Guest",
        userName: "Guest" + Date.now(),
        email: null,
        avatar: {
          src: null,
          _id: null,
        },
        _id: "123",
        token: null,
      },
      login: (payload: User) => set(() => ({ user: payload })),

      logout: () =>
        set(() => ({
          user: {
            name: "visitante",
            userName: "Guest" + Date.now(),
            email: null,
            avatar: {
              src: null,
              _id: null,
            },
            id: null,
            token: null,
          },
        })),

      data: [],

      totalPosts: null,

      loading: false,

      nextUrl: null,

      previousUrl: null,

      createIsOpen: false,

      updateIsOpen: false,

      currentPostUpdatingId: null,

      postIsLoading: false,

      setPostIsLoading: (payload: boolean) =>
        set(() => ({
          postIsLoading: payload,
        })),

      setCurrentPostUpdatingId: (payload: string) =>
        set(() => ({
          currentPostUpdatingId: payload,
        })),

      setCreateIsOpen: (payload: boolean) =>
        set(() => ({
          createIsOpen: payload,
        })),

      setUpdateIsOpen: (payload: boolean) =>
        set(() => ({
          updateIsOpen: payload,
        })),

      // Mutador para atualizar o estado com os dados da API
      setData: (data: any) => set({ data }),

      // Mutador para definir o estado de carregamento
      setLoading: (loading: any) => set({ loading }),

      // Função para fazer a chamada à API
      fetchData: async (payload: string) => {
        try {
          set({ loading: true });
          const response = await axios.get(payload);
          set({ data: response.data.results });
          set({ nextUrl: response.data.nextUrl });
          set({ previousUrl: response.data.previousUrl });
          set({ loading: false });
          set({ totalPosts: response.data.total });
        } catch (error) {
          console.error("Erro ao buscar dados da API:", error);
          set({ loading: false });
        }
      },

      fetchDataProfile: async (payload: string | null) => {
        try {
          set({ loading: true });
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASEURL}/post/byUserName/${payload}`
          );
          set({ data: response.data });
          set({ loading: false });
        } catch (error) {
          console.error("Erro ao buscar dados da API:", error);
          set({ loading: false });
        }
      },

      saveToken: (payload: string) =>
        set((state: { user: User }) => ({
          user: { ...state.user, token: payload },
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
