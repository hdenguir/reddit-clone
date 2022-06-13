import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaReddit } from 'react-icons/fa';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CommunityState } from '../atoms/communitiesAtom';
import {
  DirectoryMenuItem,
  directoryMenuStateAtom,
} from '../atoms/directoryMenuAtom';

const useDirectory = () => {
  const router = useRouter();
  const [directoryState, setDirectoryState] = useRecoilState(
    directoryMenuStateAtom,
  );
  const communityStateValue = useRecoilValue(CommunityState);

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({ ...prev, selectedMenuItem: menuItem }));
    router.push(menuItem.link);
    if (directoryState.isOpen) toggleMenuOpen();
  };

  useEffect(() => {
    const { currentCommunity } = communityStateValue;
    if (currentCommunity) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${currentCommunity.id}`,
          link: `/r/${currentCommunity.id}`,
          imageURL: currentCommunity.imageURL,
          icon: FaReddit,
          iconColor: 'blue.500',
        } as DirectoryMenuItem,
      }));
    }
  }, [communityStateValue]);

  return {
    directoryState,
    setDirectoryState,
    toggleMenuOpen,
    onSelectMenuItem,
  };
};

export default useDirectory;
