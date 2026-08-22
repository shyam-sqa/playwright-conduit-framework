export type ArticleInput = {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
};

export type Article = ArticleInput & {
  slug: string;
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
};

export type ArticleResponse = {
  article: Article;
};
