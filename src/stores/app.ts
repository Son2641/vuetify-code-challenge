import { defineStore } from "pinia";
import { type BlogPost, type BlogFormField } from "@/types/globals";
import type { VForm } from "vuetify/components";

export const useAppStore = defineStore(
  "app",
  () => {
    // Refs
    const blogTitle = ref(undefined);
    const blogText = ref(undefined);
    const blogAuthor = ref(undefined);
    const blogPosts = ref<BlogPost[]>([]);
    const isFormOpen = ref<boolean>(false);
    const isEditing = ref<boolean>(false);
    const editBlogId = ref(undefined);
    const blogForm = ref<VForm | null>(null);

    // Methods
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

    const closeForm = (): void => {
      if (isEditing) {
        resetEditVariables();
        resetForm();
      }

      isFormOpen.value = false;
    };

    const resetForm = (): void => {
      blogForm.value?.reset();
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
      closeForm,
      blogForm,
      resetForm,
    };
  },
  {
    persist: true,
  }
);
