export type BlogPost = {
  id: string;
  title: string;
  text: string;
  author: string;
  date: Date;
};

export type BlogFormField = Partial<Omit<BlogPost, "id" | "date">>;
