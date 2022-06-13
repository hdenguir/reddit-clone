import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import About from '../../../components/Community/About';
import PageContent from '../../../components/Layout/PageContent';
import NewPostForm from '../../../components/Posts/NewPostForm';
import { auth } from '../../../firebase/client';
import useCommunityData from '../../../hooks/useCommunityData';

type SubmitPostProps = {};

const SubmitPostPage: React.FC<SubmitPostProps> = () => {
  const [user] = useAuthState(auth);

  const { communityStateValue } = useCommunityData();

  return (
    <PageContent>
      <>
        <Box>
          <Text p="14px 0px" borderBottom="1px solid" borderColor="white">
            Create a post
          </Text>
        </Box>
        {user && (
          <NewPostForm
            user={user}
            communityImageURL={communityStateValue.currentCommunity?.imageURL}
          />
        )}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};
export default SubmitPostPage;
