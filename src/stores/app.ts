import { defineStore } from "pinia";
import { type BlogPost, type BlogFormField } from "@/types/globals";

export const useAppStore = defineStore(
  "app",
  () => {
    const blogTitle = ref(undefined);
    const blogText = ref(undefined);
    const blogAuthor = ref(undefined);
    const blogPosts = ref<BlogPost[]>([]);
    const isFormOpen = ref<boolean>(false);
    const isEditing = ref<boolean>(false);
    const editBlogId = ref(undefined);

    const openEditForm = (blog: BlogPost): void => {
      isEditing.value = true;
      isFormOpen.value = true; // Reuse the same form dialog
      blogTitle.value = blog.title;
      editBlogId.value = blog.id;
      blogText.value = blog.text;
      blogAuthor.value = blog.author;
    };

    const resetEditVariables = (): void => {
      isEditing.value = false;
      editBlogId.value = undefined;
    };

    return {
      blogTitle,
      blogText,
      blogAuthor,
      blogPosts,
      isFormOpen,
      openEditForm,
      isEditing,
      editBlogId,
      resetEditVariables,
    };
  },
  {
    persist: true,
  }
);
