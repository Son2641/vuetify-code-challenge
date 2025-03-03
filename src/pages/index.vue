<script lang="ts" setup>
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { createBlogPost, editBlogPost, deleteBlogPost } from "@/utils";
import { type BlogPost, type BlogFormField } from "@/types/globals";
import type { VForm } from "vuetify/components";

// Refs
const blogForm = ref<VForm | null>(null);
const isLoading = ref<boolean>(false);

// Store
const store = useAppStore();
const {
  isFormOpen,
  blogTitle,
  blogAuthor,
  blogText,
  blogPosts,
  isEditing,
  editBlogId,
} = storeToRefs(store);

//Form Placeholders
const formPlaceholders = {
  blogTitle: "The next big thing",
  blogText: `What's on your mind?`,
  blogAuthor: "John Doe",
};

//Form Rules
const rules = [
  (value: string) => {
    if (value) return true;
    return "This field is required.";
  },
];

// Methods

const submitBlog = async (
  { title, text, author }: BlogFormField,
  blogPostArr: BlogPost[]
): Promise<void> => {
  //Check if form is valid
  if (!blogForm.value) return;
  const { valid } = await blogForm.value.validate();
  if (!valid) return; // Prevent submission if form is invalid

  // Show loading state immediately if valid
  isLoading.value = true;

  // Mock loading state

  setTimeout(() => {
    if (isEditing.value && editBlogId.value) {
      // Editing existing post
      editBlogPost(editBlogId.value, { title, text, author }, blogPostArr);
    } else {
      // Creating new post
      createBlogPost({ title, text, author }, blogPostArr);
    }

    // Reset editing state
    store.resetEditVariables();

    // Reset and close the dialog AFTER loading state is shown
    reset();
    isLoading.value = false;
    isFormOpen.value = false;
  }, 2000);
};

const reset = (): void => {
  blogForm.value?.reset();
};
</script>

<template>
  <v-container>
    <h2>Speak up your mind</h2>
    <div class="pa-4 text-center">
      <v-dialog v-model="isFormOpen" max-width="600" class="pa-2">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-none font-weight-regular"
            prepend-icon="mdi-post"
            text="Create a post"
            variant="tonal"
            v-bind="activatorProps"
          ></v-btn>
        </template>

        <v-sheet class="pa-6">
          <v-form ref="blogForm" @submit.prevent fast-fail>
            <v-text-field
              v-model="blogTitle"
              label="Blog Title"
              :placeholder="formPlaceholders.blogTitle"
              variant="outlined"
            ></v-text-field>
            <v-textarea
              v-model="blogText"
              :rules
              label="Write a post"
              :placeholder="formPlaceholders.blogText"
              clear-icon="mdi-close-circle"
              variant="outlined"
              class="mb-2"
            ></v-textarea>
            <v-text-field
              v-model="blogAuthor"
              label="Authored by:"
              :placeholder="formPlaceholders.blogAuthor"
              variant="outlined"
            ></v-text-field>
            <v-btn text="Reset" variant="plain" @click="reset"></v-btn>
            <v-btn
              text="Close"
              variant="plain"
              @click="isFormOpen = false"
            ></v-btn>

            <v-btn
              color="primary"
              type="submit"
              variant="tonal"
              :loading="isLoading"
              @click="
                submitBlog(
                  { title: blogTitle, text: blogText, author: blogAuthor },
                  blogPosts
                )
              "
              >{{ isEditing ? "Update Post" : "Create Post" }}
              <template v-slot:loader>
                <v-progress-circular
                  color="primary"
                  indeterminate="disable-shrink"
                  size="15"
                  width="2"
                ></v-progress-circular>
              </template>
            </v-btn>
          </v-form>
        </v-sheet>
      </v-dialog>
    </div>
    <div v-if="!blogPosts.length">No blog posts yet. Be the first one!</div>
    <div v-else>
      <div v-for="blog in blogPosts" :key="blog.id" class="my-2">
        <v-card>
          <v-card-title>{{ blog.title }}</v-card-title>
          <v-card-text>{{ blog.text }}</v-card-text>
          <v-card-subtitle>Authored by: {{ blog.author }}</v-card-subtitle>
          <v-card-actions>
            <v-btn
              density="compact"
              icon="mdi-delete"
              @click.prevent="deleteBlogPost(blog.id, blogPosts)"
            ></v-btn>
            <v-btn
              density="compact"
              icon="mdi-pencil"
              @click.prevent="store.openEditForm(blog)"
            ></v-btn>
          </v-card-actions>
          <v-card-subtitle>
            {{
              blog.isEdited
                ? `Edited at ${blog.editDateTime}`
                : `Created at ${blog.createdDateTime}`
            }}
          </v-card-subtitle>
        </v-card>
      </div>
    </div>
  </v-container>
</template>
