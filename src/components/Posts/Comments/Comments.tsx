import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { Post, postState } from '../../../atoms/postsAtom';
import { firestore } from '../../../firebase/client';
import CommentInput from './CommentInput';
import CommentItem, { Comment } from './CommentItem';

type CommentsProps = {
  user: User;
  selectedPost: Post;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  // local state
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState('');
  const setPostStateValue = useSetRecoilState(postState);

  // local functions
  const onCreateComment = async () => {
    setCreateLoading(true);
    try {
      // Create a comment document
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, 'comments'));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user?.uid,
        creatorDisplayText: user.email!.split('@')[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      // update post numberOfComments + 1
      const postRef = doc(firestore, 'posts', selectedPost?.id! as string);

      batch.update(postRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      // update recoil state
      setCommentText('');
      setComments((prev) => [newComment, ...prev]);

      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error: any) {
      console.log('createComment Error : ', error.message);
    }
    setCreateLoading(false);
  };
  const onDeleteComment = async (comment: Comment) => {
    setLoadingDeleteId(comment.id);
    // delete a comment document
    try {
      const batch = writeBatch(firestore);
      const commentRef = doc(firestore, 'comments', comment.id);
      batch.delete(commentRef);

      // update post numberOfComments - 1
      const postRef = doc(firestore, 'posts', selectedPost.id!);

      batch.update(postRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      setComments((prev) => prev.filter((item) => item.id !== comment.id));

      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));
    } catch (error: any) {
      console.log('onDeleteComment Error : ', error.message);
    }
    setLoadingDeleteId('');
  };
  const getPostComments = async () => {
    try {
      const commentQuery = query(
        collection(firestore, 'comments'),
        where('postId', '==', selectedPost?.id),
        orderBy('createdAt', 'desc'),
      );
      const commentDocs = await getDocs(commentQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log('getPostComments Error :', error.message);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (selectedPost) getPostComments();
  }, [selectedPost]);
  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
      <Flex
        direction="column"
        pl={10}
        pr={4}
        pb={6}
        fontSize="10pt"
        width="100%"
      >
        {!fetchLoading && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            onCreateComment={onCreateComment}
            createLoading={createLoading}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding={6} bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No comments Yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    userId={user?.uid}
                    loadingDelete={loadingDeleteId === comment.id}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
