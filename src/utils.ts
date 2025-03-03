import { type BlogPost, type BlogFormField } from "@/types/globals";

// Function to create a blog post
export const createBlogPost = (
  { title, text, author }: BlogFormField,
  blogPostArr: BlogPost[]
): BlogPost => {
  const newPost: BlogPost = {
    id: crypto.randomUUID(),
    title,
    text,
    author,
    date: new Date(),
  };

  blogPostArr.push(newPost);
  return newPost;
};

// Function to edit a blog post
export const editBlogPost = (
  id: string,
  updatedFields: BlogFormField,
  blogPostArr: BlogPost[]
): BlogPost | null => {
  const postIndex = blogPostArr.findIndex((post) => post.id === id);
  if (postIndex === -1) return null;

  blogPostArr[postIndex] = {
    ...blogPostArr[postIndex],
    ...updatedFields,
  };

  return blogPostArr[postIndex];
};

// Function to delete a blog post
export const deleteBlogPost = (
  id: string,
  blogPostArr: BlogPost[]
): boolean => {
  const postIndex = blogPostArr.findIndex((post) => post.id === id);
  if (postIndex === -1) return false;

  blogPostArr.splice(postIndex, 1);
  return true;
};
