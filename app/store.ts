import { create } from "zustand";

import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  avatar: string;
  email: string;
  password: string;
  name: string;
  userName: string;
  __v: number;
  _id: string;
  token: string;
  followers: any[];
  following: any[];
  createdAt: string;
}

export const useStore = create(
  persist(
    (set: any) => ({
      user: {
        bio: "",
        avatar: "",
        email: "",
        password: "",
        name: "",
        userName: "",
        __v: 0,
        _id: "",
        token: "",
        followers: [],
        following: [],
      },

      loginRemember: {
        email: "",
        password: "",
        isChecked: false,
      },

      setLoginRemember: (payload: {
        email: string;
        password: string;
        isChecked: boolean;
      }) =>
        set(
          (state: {
            loginRemember: {
              email: string;
              password: string;
              isChecked: boolean;
            };
          }) => ({
            loginRemember: payload,
          })
        ),

      setUser: (payload: User) =>
        set((state: { user: User }) => ({
          user: payload,
        })),

      logout: () =>
        set({
          user: {
            bio: "",
            avatar: "",
            email: "",
            password: "",
            name: "",
            userName: "",
            __v: 0,
            _id: "",
            token: "",
          },
        }),

      setEditedUser: (userName: string, bio: string, avatar: string) =>
        set((state: { user: User }) => ({
          user: {
            ...state.user,
            userName: userName,
            bio: bio,
            avatar: avatar,
          },
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
