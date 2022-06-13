import { Stack } from '@chakra-ui/react';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { CommunityState } from '../atoms/communitiesAtom';
import { Post, postState, PostVote } from '../atoms/postsAtom';
import CreatePostLink from '../components/Community/CreatePostLink';
import PersonalHome from '../components/Community/PersonalHome';
import Premium from '../components/Community/Premium';
import Recommandations from '../components/Community/Recommandations';
import PageContent from '../components/Layout/PageContent';
import PostItem from '../components/Posts/PostItem';
import PostLoader from '../components/Posts/PostLoader';
import { auth, firestore } from '../firebase/client';
import usePosts from '../hooks/usePosts';

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { mySnippets, snippetsFetched } = useRecoilValue(CommunityState);

  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts();

  const buildUserHomeFeed = async () => {
    // Fetch more posts
    setLoading(true);
    try {
      if (mySnippets.length > 0) {
        const myCommunityIds = mySnippets.map((snippet) => snippet.communityId);

        const postQuery = query(
          collection(firestore, 'posts'),
          where('postId', 'in', myCommunityIds),
        );

        const postDocs = await getDocs(postQuery);

        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostStateValue((prev) => ({ ...prev, posts: posts as Post[] }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error: any) {
      console.log('buildUserHomeFeed Error :', error.message);
    }
    setLoading(false);
  };

  const buildNoUserHomeFeed = async () => {
    setLoading(true);

    try {
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10),
      );

      const postDocs = await getDocs(postQuery);

      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({ ...prev, posts: posts as Post[] }));
    } catch (error: any) {
      console.log('buildNoUserHomeFeed Error :', error.message);
    }

    setLoading(false);
  };

  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      console.log({ postIds });
      const postVoteQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where('postId', 'in', postIds),
      );
      const postVoteDocs = await getDocs(postVoteQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error: any) {
      console.log('getUserPostVotes Error :', error.message);
    }
  };

  useEffect(() => {
    if (snippetsFetched) buildUserHomeFeed();
  }, [snippetsFetched, buildUserHomeFeed]);

  useEffect(() => {
    if (!user && !loadingUser) {
      buildNoUserHomeFeed();
    }
  }, [user, loadingUser, buildNoUserHomeFeed]);

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, postStateValue.posts, getUserPostVotes, setPostStateValue]);

  return (
    <PageContent>
      <>
        <CreatePostLink />
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
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5}>
        <Recommandations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContent>
  );
};

export default Home;
