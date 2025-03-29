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
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.700", "white");

  const handleSendCode = async () => {
    try {
      setIsLoading(true);
      await signIn(phoneNumber);
      setShowVerification(true);
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        status: "error",
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
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    size="lg"
                  />
                  <Button
                    mt={4}
                    colorScheme="brand"
                    width="full"
                    onClick={handleSendCode}
                    isLoading={isLoading}
                    size="lg"
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
                  />
                  <Button
                    mt={4}
                    colorScheme="brand"
                    width="full"
                    onClick={handleVerifyCode}
                    isLoading={isLoading}
                    size="lg"
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