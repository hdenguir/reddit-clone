import { Box, Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaReddit } from 'react-icons/fa';
import { GrAdd } from 'react-icons/gr';
import { useRecoilValue } from 'recoil';
import { CommunityState } from '../../../atoms/communitiesAtom';
import CreateCommunityModal from '../../Modal/CreateCommunity/CreateCommunityModal';
import MenuListItem from './MenuListItem';

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const mySnippets = useRecoilValue(CommunityState).mySnippets;
  return (
    <>
      <CreateCommunityModal open={open} handleClose={handleClose} />
      <Box mt={3} mr={4}>
        <Text pl={1} fontSize="10pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {mySnippets
          .filter((s) => s.isModerator)
          .map((snippet) => (
            <>
              <MenuListItem
                key={snippet.communityId}
                displayText={`r/${snippet.communityId}`}
                link={`/r/${snippet.communityId}`}
                imageURL={snippet.imageURL}
                icon={FaReddit}
                iconColor="blue.500"
              />
            </>
          ))}
      </Box>
      <Box mt={3} mr={4}>
        <Text pl={1} fontSize="10pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>

        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: 'gray.100' }}
          onClick={() => setOpen(true)}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
          <>
            <MenuListItem
              key={snippet.communityId}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              imageURL={snippet.imageURL}
              icon={FaReddit}
              iconColor="blue.500"
            />
          </>
        ))}
      </Box>
    </>
  );
};
export default Communities;
