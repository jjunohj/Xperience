import { Post } from "contentlayer/generated";

export type Optional<Type, Key extends keyof Type> = Omit<Type, Key> &
  Partial<Pick<Type, Key>>;

export type ReducedPost = Omit<Omit<Omit<Post, "body">, "_raw">, "_id">;

export type Category = Post & {
  posts: ReducedPost[];
};

/**
 * 목차 타입
 */
export type SubSection = {
  slug: string;
  text: string;
};
export type Section = SubSection & {
  subSections: SubSection[];
};
export type TableOfContents = Section[];
