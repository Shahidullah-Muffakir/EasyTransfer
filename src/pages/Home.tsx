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
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link as RouterLink } from "react-router-dom";

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
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requestToDelete, setRequestToDelete] = useState<TransferRequest | null>(null);

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

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Send & Receive Money</Heading>
        {/* {user && (
          <Button as={RouterLink} to="/create" colorScheme="blue">
            Create Request
          </Button>
        )} */}
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">
                  {request.amount.toLocaleString()}
                  <Text as="span" fontSize="sm" color="gray.600">
                    {request?.currency?.toUpperCase()}
                  </Text>
                </Heading>
                <Badge colorScheme="blue">
                  {request.fromCountry}{" "}
                  <Text  style={{fontSize:7}}as="span" fontSize="xs" color="gray.500">
                    ({request?.fromCity?.substring(0,3)})
                  </Text>
                  → {request.toCountry}{" "}
                  <Text as="span" style={{fontSize:7}} fontSize="xs" color="gray.500">
                    ({request.toCity?.substring(0,3)})
                  </Text>
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={2}>
                {request.name && (
                  <Text>
                    <strong>Name:</strong> {request.name}
                  </Text>
                )}
                <Text>
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
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Transfer Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Are you sure you want to delete this transfer request?</Text>
            <Text mt={2} fontWeight="bold">
              ₹{requestToDelete?.amount.toLocaleString()}
            </Text>
            <Text>
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
    </Box>
  );
};

export default Home;
