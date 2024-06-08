import { allPosts } from "contentlayer/generated";
import PostLayout from "@/src/components/layouts/PostLayout";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({ params }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  return { title: post?.title || "Untitled Post" };
};

const Page = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <PostLayout post={post} />;
};

export default Page;
