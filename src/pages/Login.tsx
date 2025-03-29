import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Container,
  Heading,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.700", "white");

  const validatePhoneNumber = (number: string): boolean => {
    // Remove all spaces
    const cleanNumber = number.replace(/\s/g, "");
    
    // Basic format validation
    if (!/^\+?[1-9]\d{1,14}$/.test(cleanNumber)) {
      setError("Please enter a valid phone number (e.g., +1234567890)");
      return false;
    }

    // Additional validation for specific formats
    if (cleanNumber.startsWith("+")) {
      // International format
      if (!/^\+[1-9]\d{1,14}$/.test(cleanNumber)) {
        setError("Invalid international phone number format");
        return false;
      }
    } else {
      // National format
      if (!/^[1-9]\d{1,14}$/.test(cleanNumber)) {
        setError("Invalid phone number format");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // Only allow numbers, +, and -
    if (/^[+\d-]*$/.test(value)) {
      setPhoneNumber(value);
      setError("");
    }
  };

  const handleSendCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }

    try {
      setIsLoading(true);
      // Format the phone number before sending
      const formattedNumber = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
      await signIn(formattedNumber);
      setShowVerification(true);
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      if (error?.error?.message?.includes("INVALID_PHONE_NUMBER")) {
        setError("Invalid phone number format. Please check and try again.");
      } else {
        toast({
          title: "Error",
          description: "Failed to send verification code. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      const confirmationResult = (window as any).confirmationResult;
      if (!confirmationResult) {
        throw new Error("No confirmation result found");
      }
      
      await confirmationResult.confirm(verificationCode);
      toast({
        title: "Success",
        description: "You have been successfully logged in",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error verifying code:", error);
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={10} minW='100vw'>
      <Container maxW="container.sm">
        <Card bg={cardBg} boxShadow="lg">
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Heading color={headingColor} mb={2}>
                  Welcome Back
                </Heading>
                <Text color={textColor}>
                  Sign in with your phone number to continue
                </Text>
              </Box>

              {!showVerification ? (
                <FormControl isInvalid={!!error}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number (e.g., +1234567890)"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    size="lg"
                    maxLength={15}
                  />
                  <FormErrorMessage>{error}</FormErrorMessage>
                  <Button
                    mt={4}
                    colorScheme="brand"
                    width="full"
                    onClick={handleSendCode}
                    isLoading={isLoading}
                    size="lg"
                    isDisabled={!phoneNumber || !!error}
                  >
                    Send Verification Code
                  </Button>
                </FormControl>
              ) : (
                <FormControl>
                  <FormLabel>Verification Code</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    size="lg"
                    maxLength={6}
                  />
                  <Button
                    mt={4}
                    colorScheme="brand"
                    width="full"
                    onClick={handleVerifyCode}
                    isLoading={isLoading}
                    size="lg"
                    isDisabled={!verificationCode}
                  >
                    Verify Code
                  </Button>
                </FormControl>
              )}
            </VStack>
            <div id="recaptcha-container" style={{ display: 'none' }}></div>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default Login; 