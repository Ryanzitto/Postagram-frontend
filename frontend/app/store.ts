import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

import axios from "axios";

interface User {
  name: null | string;
  userName: null | string;
  email: null | string;
  avatar: null | string;
  id: null | string;
  token: null | string;
}

const unkownUser = {
  name: null,
  userName: null,
  email: null,
  avatar: null,
  id: null,
  _id: null,
  token: null,
  bio: null,
};

export const useStore = create(
  persist(
    (set: any) => ({
      user: unkownUser,
      login: (payload: User) => set(() => ({ user: payload })),

      logout: () =>
        set(() => ({
          user: unkownUser,
        })),

      data: [],
      loading: false,

      createIsOpen: false,

      updateIsOpen: false,

      currentPostUpdatingId: null,

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
      fetchData: async () => {
        try {
          set({ loading: true });
          const response = await axios.get("http://localhost:3000/news");
          set({ data: response.data.results });
          set({ loading: false });
        } catch (error) {
          console.error("Erro ao buscar dados da API:", error);
          set({ loading: false });
        }
      },

      fetchDataProfile: async (payload: string | null) => {
        try {
          set({ loading: true });
          const response = await axios.get(
            `http://localhost:3000/news/byUserName/${payload}`
          );
          console.log(response.data);
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
