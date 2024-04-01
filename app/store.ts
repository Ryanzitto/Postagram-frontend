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

interface UserInfoSocket {
  username: string;
  name: string;
  avatar: string;
}

interface ChatMessage {
  text: string;
  username: string;
  createdAt: string;
}

interface Notification {
  text: string;
  username: string;
  createdAt: string;
  type: string;
  id: string;
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

      connectedUsers: [],

      setConnectedUsers: (payload: UserInfoSocket[]) =>
        set(() => ({
          connectedUsers: payload,
        })),

      loginRemember: {
        email: "",
        password: "",
        isChecked: false,
      },

      chatMessages: [],

      notifications: [
        { text: "", username: "pedro", createdAt: "dd", type: "", id: "" },
      ],

      addChatMessage: (newMessage: ChatMessage) =>
        set((state: any) => ({
          chatMessages: [...state.chatMessages, newMessage],
        })),

      addNotification: (newNotification: Notification) =>
        set((state: any) => ({
          notifications: [...state.notifications, newNotification],
        })),

      setNotification: (payload: Notification[]) =>
        set((state: any) => ({
          notifications: payload,
        })),
      clearNotification: () =>
        set((state: any) => ({
          notifications: [],
        })),

      clearChat: () =>
        set((state: any) => ({
          chatMessages: [],
        })),

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

      setEditedUser: (bio: string, avatar: string) =>
        set((state: { user: User }) => ({
          user: {
            ...state.user,
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
