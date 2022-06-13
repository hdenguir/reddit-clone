import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { TiHome } from 'react-icons/ti';
import useDirectory from '../../../hooks/useDirectory';
import Communities from './Communities';

const Directory: React.FC = () => {
  const { directoryState, setDirectoryState, toggleMenuOpen } = useDirectory();
  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        cursor="pointer"
        padding="0px 4px"
        mr={2}
        ml={{ base: 0, md: 2 }}
        borderRadius={4}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
        onClick={toggleMenuOpen}
      >
        <Flex
          align="center"
          justifyContent="space-between"
          width={{ base: 'auto', lg: '200px' }}
        >
          <Flex align="center">
            {directoryState.selectedMenuItem.imageURL ? (
              <Image
                src={directoryState.selectedMenuItem.imageURL}
                borderRadius="full"
                boxSize="24px"
                mr={4}
              />
            ) : (
              <Icon
                fontSize={24}
                mr={{ base: 1, md: 2 }}
                as={directoryState.selectedMenuItem.icon}
                color={directoryState.selectedMenuItem.iconColor}
              />
            )}
            {/* <Icon fontSize={20} mr={{ base: 1, md: 2 }} as={TiHome} /> */}
            <Flex display={{ base: 'none', lg: 'flex' }}>
              <Text fontWeight={600}>
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default Directory;
