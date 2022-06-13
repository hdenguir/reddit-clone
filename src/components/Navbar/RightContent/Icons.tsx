import { Flex, Icon } from '@chakra-ui/react';
import React from 'react';
import { BsArrowUpRightCircle, BsChatDots } from 'react-icons/bs';
import {
  IoVideocamOutline,
  IoFilterCircleOutline,
  IoNotificationsOutline,
} from 'react-icons/io5';
import { GrAdd } from 'react-icons/gr';

const Icons: React.FC = () => {
  return (
    <Flex>
      <Flex
        display={{ base: 'none', md: 'flex' }}
        align="center"
        borderRight="1px solid"
        borderColor="gray.200"
      >
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          borderRadius={4}
          cursor="pointer"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={BsArrowUpRightCircle} fontSize={20} />
        </Flex>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          borderRadius={4}
          cursor="pointer"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={IoFilterCircleOutline} fontSize={22} />
        </Flex>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          borderRadius={4}
          cursor="pointer"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={IoVideocamOutline} fontSize={22} />
        </Flex>
      </Flex>
      <>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          borderRadius={4}
          cursor="pointer"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={BsChatDots} fontSize={20} />
        </Flex>{' '}
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          borderRadius={4}
          cursor="pointer"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={IoNotificationsOutline} fontSize={20} />
        </Flex>{' '}
        <Flex
          display={{ base: 'none', md: 'flex' }}
          mr={1.5}
          ml={1.5}
          padding={1}
          borderRadius={4}
          cursor="pointer"
          _hover={{ bg: 'gray.200' }}
        >
          <Icon as={GrAdd} fontSize={20} />
        </Flex>
      </>
    </Flex>
  );
};
export default Icons;
