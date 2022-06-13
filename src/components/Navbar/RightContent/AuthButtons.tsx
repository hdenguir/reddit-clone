import { Button } from '@chakra-ui/react';
import React from 'react';
import {useSetRecoilState} from 'recoil';
import {authModal} from "../../../atoms/authModalAtom"
 
type AuthButtonsProps = {}; 

const AuthButtons: React.FC<AuthButtonsProps> = () => {
  const setAuthModalState = useSetRecoilState(authModal);

  return (   
    <>
      <Button
        variant="outline"
        height="28px"
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
        mr={2}
        onClick={() => setAuthModalState(prev=>({ open: true, view: 'login'}))}
      >
        Log In   
      </Button>
      <Button
        height="28px"
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
        onClick={() => setAuthModalState(prev=>({open: true, view: 'signup'}))}
      >
        Sign Up
      </Button>
    </>
  );
};

export default AuthButtons;
