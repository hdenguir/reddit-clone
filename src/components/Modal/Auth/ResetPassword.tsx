import { Button, Flex, Icon, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModal } from '../../../atoms/authModalAtom';
import { auth } from '../../../firebase/client';
import { BsReddit } from 'react-icons/bs';
import {
  useCreateUserWithEmailAndPassword,
  useSendPasswordResetEmail,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { FIREBASE_ERRORS } from '../../../firebase/errors';

type ResetPasswordProps = {};

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const setAuthModalState = useSetRecoilState(authModal);
  const [success, setSuccess] = useState(false);
  const [resetPasswordForm, setResetPasswordForm] = useState({
    email: '',
  });
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendPasswordResetEmail(resetPasswordForm.email);
    setSuccess(true);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize="40" mb={2} />
      <Text fontWeight={700} mb={2}>
        Reset your Password
      </Text>
      {success ? (
        <Text mb={4}>Check your email :)</Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb={2}>
            Enter the email associated with your account and we'll send you a
            reset link
          </Text>

          <form onSubmit={onSubmit}>
            <Input
              required
              name="email"
              placeholder="Email"
              type="email"
              mb={2}
              onChange={onChange}
              value={resetPasswordForm.email}
              fontSize="10pt"
              _placeholder={{
                color: 'gray.500',
              }}
              _hover={{
                bg: 'white',
                border: '1px solid',
                borderColor: 'blue.500',
              }}
              _focus={{
                outline: 'none',
                bg: 'white',
                border: '1px solid',
                borderColor: 'blue.500',
              }}
              bg="gray.50"
            />

            <Button width="100%" height="36px" mt={2} mb={2} type="submit">
              Reset
            </Button>
            <Flex fontSize="9pt" justifyContent="center" mb={2}>
              <Text
                color="blue.500"
                fontWeight={700}
                cursor="pointer"
                onClick={() =>
                  setAuthModalState((prev) => ({ ...prev, view: 'login' }))
                }
              >
                Log In
              </Text>

              <Text color="gray.400"> - </Text>

              <Text
                color="blue.500"
                fontWeight={700}
                cursor="pointer"
                onClick={() =>
                  setAuthModalState((prev) => ({ ...prev, view: 'signup' }))
                }
              >
                Sign Up
              </Text>
            </Flex>
          </form>
        </>
      )}
    </Flex>
  );
};
export default ResetPassword;
