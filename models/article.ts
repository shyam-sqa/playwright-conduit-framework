export type ArticleInput = {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
};

export type Article = Omit<ArticleInput, 'tagList'> & {
  tagList: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
};

export type ArticleResponse = {
  article: Article;
};
