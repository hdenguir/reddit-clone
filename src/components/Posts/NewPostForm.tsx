import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { MdPoll } from 'react-icons/md';
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { Post } from '../../atoms/postsAtom';
import ImageUpload from './PostForm/ImageUpload';
import TextInputs from './PostForm/TextInputs';
import TabItem from './TabItem';
import { firestore, storage } from '../../firebase/client';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import useSelectFile from '../../hooks/useSelectFile';

type NewPostFormProps = {
  user: User;
  communityImageURL?: string;
};

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const formTabs: TabItem[] = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Image & Video',
    icon: IoImageOutline,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Poll',
    icon: MdPoll,
  },
  {
    title: 'Talk',
    icon: BsMic,
  },
];
const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  communityImageURL,
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [loading, setLoading] = useState(false);

  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  });

  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();

  const [error, setError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTextInputs((prev) => ({ ...prev, [e?.target?.name]: e?.target?.value }));
  };

  const handleCreatePost = async () => {
    const { communityId } = router.query;
    // Create new post object => type post
    const newPost: Post = {
      communityId: communityId as string,
      communityImageURL: communityImageURL || '',
      creatorId: user?.uid,
      creatorDisplayName: user.email!.split('@')[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    // Store the post in db
    setLoading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);

      // Check for selectedFile
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');

        // Store in storage => getDownloadURL
        const downloadURL = await getDownloadURL(imageRef);

        // update Post imageURL
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }

      // Clean fields
      setTextInputs({ title: '', body: '' });
      setSelectedFile('');
      // Redirect to home page
      router.back();
    } catch (error: any) {
      console.log('HandleCreatePost error: ', error.message);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={3}>
      <Flex width="100%">
        {formTabs.map((item: TabItem) => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            title={textInputs.title}
            body={textInputs.body}
            handleChange={handleChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}

        {selectedTab === 'Image & Video' && (
          <ImageUpload
            onSelectImage={onSelectFile}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
          />
        )}
      </Flex>

      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text>Error creating post ...</Text>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;
