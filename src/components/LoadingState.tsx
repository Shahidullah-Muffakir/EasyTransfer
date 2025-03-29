import {
  Box,
  VStack,
  Skeleton,
  Text,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Center minH="60vh" minW='100vw'>
      <Box
        w="full"
        maxW="container.md"
        p={8}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6} align="stretch">
          <Text
            fontSize="xl"
            fontWeight="semibold"
            textAlign="center"
            color={textColor}
          >
            {message}
          </Text>
          <VStack spacing={4} align="stretch">
            <Skeleton height="40px" borderRadius="md" />
            <Skeleton height="40px" borderRadius="md" />
            <Skeleton height="40px" borderRadius="md" />
            <Skeleton height="40px" borderRadius="md" />
            <Skeleton height="40px" borderRadius="md" />
            <Skeleton height="40px" borderRadius="md" />
            <Skeleton height="40px" borderRadius="md" />
            <Skeleton height="40px" borderRadius="md" />
          </VStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoadingState; 