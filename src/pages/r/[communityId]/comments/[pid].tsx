import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Community } from '../../../../atoms/communitiesAtom';
import { Post } from '../../../../atoms/postsAtom';
import About from '../../../../components/Community/About';
import PageContent from '../../../../components/Layout/PageContent';
import Comments from '../../../../components/Posts/Comments/Comments';
import PostItem from '../../../../components/Posts/PostItem';
import { auth, firestore } from '../../../../firebase/client';
import useCommunityData from '../../../../hooks/useCommunityData';
import usePosts from '../../../../hooks/usePosts';

type PostPageProps = {};

const PostPage: React.FC<PostPageProps> = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();
  const { communityStateValue, setCommunityStateValue } = useCommunityData();
  const router = useRouter();

  const fetchPost = async (postId: string) => {
    try {
      const postRef = doc(firestore, 'posts', postId);
      const postDoc = await getDoc(postRef);

      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error: any) {
      console.log('fetchPost Error :', error.message);
    }
  };

  useEffect(() => {
    const { pid } = router.query;
    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost, fetchPost]);

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            onVote={onVote}
            onDeletePost={onDeletePost}
            post={postStateValue.selectedPost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selectedPost?.id,
              )?.voteValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}

        <Comments
          user={user as User}
          selectedPost={postStateValue.selectedPost as Post}
          communityId={postStateValue.selectedPost?.communityId as string}
        />
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};
export default PostPage;
