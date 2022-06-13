import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Community } from '../../atoms/communitiesAtom';
import { Post } from '../../atoms/postsAtom';
import { auth, firestore } from '../../firebase/client';
import usePosts from '../../hooks/usePosts';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();

  const getPosts = async () => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityData.id),
        orderBy('createdAt', 'desc'),
      );

      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({ ...prev, posts: posts as Post[] }));
    } catch (error: any) {
      console.log('getPosts error :', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [communityData.id]);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post: Post) => (
            <PostItem
              key={post.id}
              post={post}
              userVoteValue={
                postStateValue.postVotes.find((v) => v.postId === post.id)
                  ?.voteValue
              }
              onVote={onVote}
              onSelectPost={() => onSelectPost(post)}
              onDeletePost={onDeletePost}
              userIsCreator={post.creatorId === user?.uid}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
