import {
  Box,
  Button,
  VStack,
  useToast,
  Container,
  Heading,
  Text,
  useColorModeValue,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.700", "white");

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "You have been successfully logged in",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Check if there's a redirect URL stored
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin"); // Clear the stored URL
        navigate(redirectUrl);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
                  Sign in with your Google account to continue
                </Text>
              </Box>

              <Button
                onClick={handleGoogleSignIn}
                colorScheme="brand"
                size="lg"
                leftIcon={<FcGoogle size={24} />}
                variant="outline"
                width="full"
                height="48px"
                fontSize="md"
                fontWeight="medium"
                _hover={{
                  transform: "translateY(-1px)",
                  boxShadow: "md",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
              >
                Continue with Google
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default Login; 