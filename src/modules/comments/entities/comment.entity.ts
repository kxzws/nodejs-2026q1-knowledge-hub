export interface Comment {
  id: string; // uuid v4
  content: string;
  articleId: string; // refers to Article
  authorId: string | null; // refers to User
  createdAt: number; // timestamp of creation
}

export class SwaggerComment implements Comment {
  id: string;
  content: string;
  articleId: string;
  authorId: string | null;
  createdAt: number;
}
