import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

type NotFoundProps = {};

const NotFound: React.FC<NotFoundProps> = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      Sorry, that community does not exist or has been banned
      <Link href="/">
        <Button mt={4}>GO Home</Button>
      </Link>
    </Flex>
  );
};
export default NotFound;
