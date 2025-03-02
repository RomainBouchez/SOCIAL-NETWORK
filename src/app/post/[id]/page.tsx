import { getSinglePost } from "@/actions/post.action";
import PostCard from "@/components/PostCard";
import { getDbUserId } from "@/actions/user.action";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getSinglePost(params.id);
  if (!post) return { title: "Post not found" };
  
  return {
    title: `Post by ${post.author.name || post.author.username}`,
    description: post.content?.slice(0, 160) || "View this post on Socially",
  };
}

async function PostPage({ params }: { params: { id: string } }) {
  const post = await getSinglePost(params.id);
  const dbUserId = await getDbUserId();

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <PostCard post={post} dbUserId={dbUserId} />
    </div>
  );
}

export default PostPage;