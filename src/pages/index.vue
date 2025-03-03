<script lang="ts" setup>
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { createBlogPost, editBlogPost, deleteBlogPost } from "@/utils";
import { type BlogPost, type BlogFormField } from "@/types/globals";

import { useDate } from "vuetify";

// Refs
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
  blogForm,
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

//Form Methods
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
    store.resetForm();
    isLoading.value = false;
    isFormOpen.value = false;
  }, 2000);
};

// Date Methods
const formatDate = (date: Date | undefined) => {
  return useDate().format(date, "keyboardDateTime24h");
};
</script>

<template>
  <v-container>
    <v-row align="center" class="pa-3">
      <h2>Speak up your mind</h2>
      <div class="pa-4 text-center">
        <v-dialog v-model="isFormOpen" max-width="600" persistent class="pa-2">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              class="text-none font-weight-regular elavation-15"
              prepend-icon="mdi-post"
              text="Create a post"
              variant="tonal"
              v-bind="activatorProps"
            ></v-btn>
          </template>

          <v-sheet class="pa-6 rounded-lg">
            <h4 class="mb-3">
              {{ isEditing ? "Edit this blog post" : "Create a new blog post" }}
            </h4>
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
              <v-btn
                text="Reset"
                variant="plain"
                @click.prevent="store.resetForm"
              ></v-btn>
              <v-btn
                text="Close"
                variant="plain"
                @click.prevent="store.closeForm"
              ></v-btn>

              <v-btn
                color="primary"
                type="submit"
                variant="tonal"
                :loading="isLoading"
                @click.prevent="
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
    </v-row>

    <div v-if="!blogPosts.length">No blog posts yet. Be the first one!</div>
    <div v-else>
      <div v-for="blog in blogPosts" :key="blog.id" class="mb-8">
        <v-card class="elevation-15 rounded-lg">
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
                ? `Edited at ${formatDate(blog.editDateTime)}`
                : `Created at ${formatDate(blog.createdDateTime)}`
            }}
          </v-card-subtitle>
        </v-card>
      </div>
    </div>
  </v-container>
</template>
