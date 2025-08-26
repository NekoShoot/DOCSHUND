import { create } from "zustand";

const useUserActivityStore = create((set) => ({
  userId: 0,
  userProfile: null,
  articles: [],
  comments: [],
  translations: [],
  loading: false,
  error: null,
  userLocation: null,

  setUserId: (userId) => set({ userId }),
  setUserProfile: (profileData) => set({ userProfile: profileData }),
  setArticles: (articles) => set({ articles }),
  setComments: (comments) => set({ comments }),
  setTranslations: (translations) => set({ translations }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
  setUserLocation: (location) => set({ userLocation: location }),
}));

export default useUserActivityStore;
