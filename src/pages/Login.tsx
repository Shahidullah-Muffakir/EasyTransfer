import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const toast = useToast();

  const handleSendCode = async () => {
    try {
      setIsLoading(true);
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const result = await signIn(formattedPhone);
      console.log('result123', result)
      setConfirmationResult(result);
      toast({
        title: 'Verification code sent',
        description: 'Please check your phone for the verification code.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send verification code. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      await confirmationResult.confirm(verificationCode);
      toast({
        title: 'Success',
        description: 'You have been successfully logged in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid verification code. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto">
      <VStack spacing={6} align="stretch">
        <Heading textAlign="center">Sign In</Heading>
        <Text textAlign="center" color="gray.600">
          Enter your phone number to receive a verification code
        </Text>
        
        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="tel"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
          />
        </FormControl>

        {!confirmationResult ? (
          <Button
            colorScheme="blue"
            onClick={handleSendCode}
            isLoading={isLoading}
          >
            Send Verification Code
          </Button>
        ) : (
          <>
            <FormControl>
              <FormLabel>Verification Code</FormLabel>
              <Input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isLoading}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              onClick={handleVerifyCode}
              isLoading={isLoading}
            >
              Verify Code
            </Button>
          </>
        )}
      </VStack>
      <div id="recaptcha-container"></div>
    </Box>
  );
};

export default Login; 