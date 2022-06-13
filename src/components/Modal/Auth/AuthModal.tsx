import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';

import { authModal } from '../../../atoms/authModalAtom';
import { auth } from '../../../firebase/client';
import OAuthButtons from './OAuthButtons';
import OAuthInputs from './OAuthInputs';
import ResetPassword from './ResetPassword';

type AuthModalProps = {};

const AuthModal: React.FC<AuthModalProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModal);

  const [user, loading, error] = useAuthState(auth);

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalState.view === 'login' && 'Login'}
            {modalState.view === 'signup' && 'Sign Up'}
            {modalState.view === 'resetPassword' && 'Reset Password'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              width="70%"
              pb={6}
            >
              {modalState.view === 'resetPassword' ? (
                <ResetPassword />
              ) : (
                <>
                  <OAuthButtons />
                  <Text color="gray.500" fontWeight={700}>
                    OR
                  </Text>
                  <OAuthInputs />
                </>
              )}
              {/* <ResetPassword /> */}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
