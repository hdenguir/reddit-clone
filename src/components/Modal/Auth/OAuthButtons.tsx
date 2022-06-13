import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../firebase/client';
import { FIREBASE_ERRORS } from '../../../firebase/errors';

type OAuthButtonsProps = {};

const OAuthButtons: React.FC<OAuthButtonsProps> = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCred) createUserDocument(userCred.user);
  }, [userCred]);

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button variant="oauth" mb={2} onClick={() => signInWithGoogle()}>
        <Image mr={2} src="/images/googlelogo.png" height="20px" /> Continue
        with Google
      </Button>
      <Button variant="oauth"> Some other Providers</Button>
      {error && (
        <Text textAlign="center" color="red" fontSize="10pt">
          {FIREBASE_ERRORS[error?.code as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
    </Flex>
  );
};
export default OAuthButtons;
