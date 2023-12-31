import {
  Avatar,
  Box,
  Flex,
  Link as LinkChakra,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';

import { LogoutIcon, SettingsIcon } from '@public/icons/sidebar';
import { removeToken } from '@/lib/http';
import useSidebarStore from '@/stores/useSidebarStore';

const AvatarBox: React.FC = () => {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/auth/sign-in`,
      redirect: true,
    });

    keepLocalStorageItem('auth');

    removeToken();
  };

  const keepLocalStorageItem = (keyToKeep: string) => {
    for (const key in localStorage) {
      if (key !== keyToKeep) {
        localStorage.removeItem(key);
      }
    }
  };

  return (
    <>
      <Flex
        borderColor="gray.100"
        borderRadius="full"
        width="full"
        padding={5}
        paddingTop={0}
        marginTop={isCollapsed ? 10 : 0}
        alignItems="center"
        justifyContent="center"
        flexDirection={isCollapsed ? 'row' : 'column-reverse'}
      >
        {isCollapsed ? (
          <>
            <Avatar
              name="Design To Chakra UI"
              bg="teal.300"
              size={'sm'}
              marginRight={2}
            />
            <Flex
              width="full"
              flexDirection="column"
              gap={4}
              justifyContent="center"
              alignItems="flex-start"
              marginLeft={2}
            >
              <Text
                fontSize={14}
                fontFamily="Gilroy-Regular"
                color="white"
                lineHeight={0}
                marginBottom={1}
              >
                Kaz Miller
              </Text>
              <Text
                as="small"
                color="white"
                fontFamily="Gilroy-Light"
                fontSize={9}
                lineHeight={0}
                marginTop={0}
              >
                City of Balbarat
              </Text>
            </Flex>
            <LinkChakra href="/user-profile">
              <SettingsIcon fontSize={30} />
            </LinkChakra>
          </>
        ) : (
          <>
            <LinkChakra href="/user-profile" marginTop={5}>
              <Tooltip
                label={'User Profile'}
                fontSize="sm"
                placement="right"
                marginTop={5}
              >
                <span>
                  <SettingsIcon fontSize={22} marginTop={5} />
                </span>
              </Tooltip>
            </LinkChakra>
            <Avatar name="Design To Chakra UI" bg="teal.300" size={'md'} />
          </>
        )}
      </Flex>
      <Box
        display="flex"
        alignItems="center"
        my={isCollapsed ? 3 : 0}
        justifyContent="center"
        textStyle={'sidebarLink'}
      >
        <LinkChakra
          display="flex"
          alignItems="center"
          _hover={{ textDecoration: 'none' }}
          width="full"
          justifyContent={'center'}
          onClick={() => handleLogout()}
          href="#"
        >
          {isCollapsed ? (
            <Flex
              alignContent={'center'}
              alignItems={'center'}
              justifyContent={'flex-start'}
              width={'85%'}
              padding={2}
              bg={'#282828'}
              borderRadius={'md'}
            >
              <LogoutIcon fontSize={30} marginLeft={2} />
              <Text marginLeft={5}>Logout</Text>
            </Flex>
          ) : (
            <Tooltip
              label={'Logout'}
              fontSize="sm"
              placement="right"
              marginTop={5}
            >
              <span>
                <LogoutIcon fontSize={22} marginTop={5} />
              </span>
            </Tooltip>
          )}
        </LinkChakra>
      </Box>
    </>
  );
};

export default AvatarBox;
