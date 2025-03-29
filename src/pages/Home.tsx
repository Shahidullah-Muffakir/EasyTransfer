import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  useToast,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import { countries } from "../data/countries";
import LoadingState from "../components/LoadingState";

interface TransferRequest {
  id: string;
  amount: number;
  currency: string;
  fromCountry: string;
  fromCity: string;
  toCountry: string;
  toCity: string;
  phoneNumber: string;
  userId: string;
  createdAt: Date;
  name: string;
}

const Home = () => {
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requestToDelete, setRequestToDelete] = useState<TransferRequest | null>(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.700", "white");

  useEffect(() => {
    const q = query(
      collection(db, "transferRequests"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as TransferRequest[];

      setRequests(newRequests);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteClick = (request: TransferRequest) => {
    setRequestToDelete(request);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;

    try {
      await deleteDoc(doc(db, "transferRequests", requestToDelete.id));
      toast({
        title: "Success",
        description: "Transfer request deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transfer request.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getCountryInfo = (code: string) => {
    return countries.find((country) => country.code === code) || { name: code, flag: "" };
  };

  if (isLoading) {
    return <LoadingState message="Loading transfer requests..." />;
  }

  return (
    <Box padding={0} justifyContent={"center"} alignItems='center'>
      <VStack spacing={8} align="stretch" alignItems='center'>
        <HStack justify="space-between">
          <Heading style={{padding:10, paddingBottom:0}} size="lg" color={headingColor}>Send & Receive Money</Heading>
        </HStack>

        {!user && (
          <Alert maxW='90%' status="info" borderRadius="md" bg="blue.50" border="1px" borderColor="blue.200">
            <AlertIcon color="blue.500" />
            <Text color="blue.700">
              To post a money transfer request, please{" "}
              <Button as={RouterLink} to="/login" variant="link" colorScheme="blue" fontWeight="bold">
                login with your phone number
              </Button>
              . This helps us prevent spam and ensure a safe community.
            </Text>
          </Alert>
        )}

        <Box alignItems='center' style={{maxWidth:'90%'}} bg={bgColor} p={8} borderRadius="xl" boxShadow="lg" border="1px" borderColor={borderColor}>
          <VStack spacing={6} align="stretch">
            <Heading size="md" color={headingColor}>Active Transfer Requests</Heading>
            <Text color={textColor} fontSize="lg">
              Find and match with others who need to transfer money between India and Afghanistan. 
              Each request is verified and includes contact information for direct communication.
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Stat p={4} bg={cardBg} borderRadius="lg" boxShadow="sm">
                <StatLabel color={textColor}>Active Requests</StatLabel>
                <StatNumber color="blue.500">{requests.length}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" color="green.500" />
                  Last 24 hours
                </StatHelpText>
              </Stat>
              <Stat p={4} bg={cardBg} borderRadius="lg" boxShadow="sm">
                <StatLabel color={textColor}>Total Amount</StatLabel>
                <StatNumber color="blue.500">
                  {requests.reduce((sum, req) => sum + req.amount, 0).toLocaleString()}
                </StatNumber>
                <StatHelpText>Across all requests</StatHelpText>
              </Stat>
            </SimpleGrid>
          </VStack>
        </Box>

        <Divider />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {requests.map((request) => {
            const fromCountry = getCountryInfo(request.fromCountry);
            const toCountry = getCountryInfo(request.toCountry);
            return (
              <Card  key={request.id} bg={cardBg} border="1px" borderColor={borderColor} _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }} transition="all 0.2s">
                <CardHeader>
                  <HStack justify="space-between">
                    <Heading size="md" color="blue.500">
                      {request.amount.toLocaleString()}
                      <Text as="span" fontSize="sm" color={textColor}>
                        {request?.currency?.toUpperCase()}
                      </Text>
                    </Heading>
                    <Badge colorScheme="blue" px={3} py={1}>
                      {fromCountry.flag} {fromCountry.code}{" "}
                      <Text as="span" fontSize="xs" color="gray.500">
                        ({request?.fromCity?.substring(0,4)})
                      </Text>
                      → {toCountry.flag} {toCountry.code}{" "}
                      <Text as="span" fontSize="xs" color="gray.500">
                        ({request.toCity?.substring(0,4)})
                      </Text>
                    </Badge>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={2}>
                    {request.name && (
                      <Text color={textColor}>
                        <strong>Name:</strong> {request.name}
                      </Text>
                    )}
                    <Text color={textColor}>
                      <strong>Contact:</strong> {request.phoneNumber}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Posted {request.createdAt.toLocaleDateString()}
                    </Text>
                    {user && user.uid === request.userId && (
                      <HStack spacing={2}>
                        <Button
                          as={RouterLink}
                          to={`/edit/${request.id}`}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          leftIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                        <IconButton
                          aria-label="Delete request"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleDeleteClick(request)}
                        />
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Transfer Request</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Text>Are you sure you want to delete this transfer request?</Text>
              <Text mt={2} fontWeight="bold" color="blue.500">
                ₹{requestToDelete?.amount.toLocaleString()}
              </Text>
              <Text color={textColor}>
                {requestToDelete?.fromCountry} → {requestToDelete?.toCountry}
              </Text>
            </ModalBody>
            <Box p={4} pt={0}>
              <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
                Delete
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Home;
