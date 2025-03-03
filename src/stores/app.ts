import { defineStore } from "pinia";
import { type BlogPost } from "@/types/globals";

export const useAppStore = defineStore(
  "app",
  () => {
    const blogTitle = ref(undefined);
    const blogText = ref(undefined);
    const blogAuthor = ref(undefined);
    const blogPosts = ref<BlogPost[]>([]);
    const isFormOpen = ref<boolean>(false);

    const clearForm = () => {
      blogAuthor.value = undefined;
      blogText.value = undefined;
    };

    return {
      blogTitle,
      blogText,
      blogAuthor,
      blogPosts,
      isFormOpen,
      clearForm,
    };
  },
  {
    persist: true,
  }
);
