import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { authModal } from '../../../atoms/authModalAtom';
import Login from './Login';
import SignUp from './SignUp';

type OAuthInputsProps = {};

const OAuthInputs: React.FC<OAuthInputsProps> = () => {
  const modalState = useRecoilValue(authModal);

  return (
    <Flex direction="column" align="center" width="100%" mt={4}>
      {modalState.view === 'login' && <Login />}
      {modalState.view === 'signup' && <SignUp />}
      {/* {modalState.view === 'resetPassword' && <ResetPassword />} */}
    </Flex>
  );
};
export default OAuthInputs;
