import { useState } from 'react';

import {
  AbsoluteCenter,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthFooterLogo, AuthImageCarousel } from '@/components/auth';
import { EmailIcon, PasswordIcon, UserIcon } from '@public/icons/auth';
import { SignInSchema, SignInSchemaType } from '@/schemas/auth/signInSchema';
import useLoginStore from '@/stores/useLoginStore';

export default function SignIn() {
  // Hooks and states
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isRememberMeChecked = useLoginStore(
    (state) => state.isRememberMeChecked
  );
  const setIsRememberMeChecked = useLoginStore(
    (state) => state.setIsRememberMeChecked
  );
  const email = useLoginStore((state) => state.email);
  const setEmail = useLoginStore((state) => state.setEmail);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    defaultValues: {
      email: isRememberMeChecked ? email : '',
      password: '',
    },
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
    setIsLoading(true);
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!res || !res.ok) {
      setIsLoading(false);
      toast({
        position: 'top',
        title: res?.error,
        status: 'error',
        duration: 3000,
      });

      return;
    }

    if (isRememberMeChecked) {
      setEmail(data.email);
    }

    router.replace('/');
  };

  return (
    <Flex
      width={'full'}
      minHeight={'100vh'}
      alignItems="center"
      justifyContent="center"
    >
      <Box width="45%" height="100vh">
        <AuthImageCarousel />
      </Box>
      <Flex
        direction="column"
        height="100vh"
        alignItems="center"
        justifyContent="center"
        width={'55%'}
      >
        <Box as="form" onSubmit={handleSubmit(onSubmit)} width={'45%'}>
          <Text fontSize={'3xl'} marginBottom={5} fontFamily={'Gilroy-Regular'}>
            Login Member Area
          </Text>
          <FormControl
            isRequired
            isInvalid={Boolean(errors.email)}
            marginBottom={5}
          >
            <FormLabel>Email Address</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Image src={UserIcon} alt="Email Icon" />
              </InputLeftElement>
              <Input
                type="email"
                placeholder="example@email.com"
                {...register('email')}
              />
            </InputGroup>
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            isRequired
            isInvalid={Boolean(errors.password)}
            marginBottom={5}
          >
            <FormLabel fontFamily={'Gilroy-Light'} fontSize={16}>
              Password
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Image src={PasswordIcon} alt="Password Icon" />
              </InputLeftElement>
              <Input
                type="password"
                placeholder="******"
                {...register('password')}
              />
            </InputGroup>
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>
          <Flex justifyContent={'space-between'} marginBottom={5}>
            <Checkbox
              fontFamily={'Gilroy-Light'}
              isChecked={isRememberMeChecked}
              onChange={() => setIsRememberMeChecked(!isRememberMeChecked)}
            >
              Remember me
            </Checkbox>
            <Link href="/auth/reset-password">
              <Text textStyle={'forgotPassword'}>Forgot Password?</Text>
            </Link>
          </Flex>
          <Button
            variant={'primary'}
            type="submit"
            width="100%"
            isLoading={isLoading}
            loadingText="Logging in..."
            size={'lg'}
          >
            <Text textStyle={'buttonText'}>Login</Text>
          </Button>
          <Box
            position="relative"
            py="10"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Divider borderColor={'black'} />
            <AbsoluteCenter
              bg="white"
              fontFamily={'Gilroy-Light'}
              fontSize={{ base: 'xs', md: 'xs', lg: 'md' }}
              alignContent={'center'}
              px={5}
              width={'235px'}
            >
              Don&apos;t have an account?
            </AbsoluteCenter>
          </Box>
          <Button
            leftIcon={<Image src={EmailIcon} alt="email-icon" />}
            colorScheme="blackAlpha"
            variant="outline"
            width={'full'}
          >
            <Text fontFamily={'Gilroy-Medium'}>Contact Element</Text>
          </Button>
        </Box>
      </Flex>
      <AuthFooterLogo />
    </Flex>
  );
}
