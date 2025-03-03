export type BlogPost = {
  id: string;
  title: string;
  text: string;
  author: string;
  createdDateTime: Date;
  isEdited?: boolean;
  editDateTime?: Date;
};

export type BlogFormField = Partial<Omit<BlogPost, "id" | "createdDateTime">>;
