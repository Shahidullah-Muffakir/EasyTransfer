import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

interface TransferRequest {
  id: string;
  amount: number;
  fromCountry: string;
  toCountry: string;
  toCity: string;
  phoneNumber: string;
  userId: string;
  createdAt: Date;
}

const EditRequest = () => {
  const { id } = useParams<{ id: string }>();
  const [amount, setAmount] = useState('');
  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [toCity, setToCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id || !user) return;

      try {
        const docRef = doc(db, 'transferRequests', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as TransferRequest;
          if (data.userId !== user.uid) {
            toast({
              title: 'Error',
              description: 'You can only edit your own requests.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            navigate('/');
            return;
          }

          setAmount(data.amount.toString());
          setFromCountry(data.fromCountry);
          setToCountry(data.toCountry);
          setToCity(data.toCity);
        } else {
          toast({
            title: 'Error',
            description: 'Request not found.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          navigate('/');
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch request details.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id, user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;

    try {
      setIsSubmitting(true);
      await updateDoc(doc(db, 'transferRequests', id), {
        amount: Number(amount),
        fromCountry,
        toCountry,
        toCity,
      });

      toast({
        title: 'Success',
        description: 'Transfer request updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update transfer request.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box maxW="md" mx="auto">
      <VStack spacing={6} align="stretch">
        <Heading textAlign="center">Edit Transfer Request</Heading>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={isSubmitting}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>From Country</FormLabel>
              <Select
                value={fromCountry}
                onChange={(e) => setFromCountry(e.target.value)}
                placeholder="Select country"
                disabled={isSubmitting}
              >
                <option value="India">India</option>
                <option value="Afghanistan">Afghanistan</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>To Country</FormLabel>
              <Select
                value={toCountry}
                onChange={(e) => setToCountry(e.target.value)}
                placeholder="Select country"
                disabled={isSubmitting}
              >
                <option value="India">India</option>
                <option value="Afghanistan">Afghanistan</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>To City</FormLabel>
              <Input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="Enter city name"
                disabled={isSubmitting}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isSubmitting}
            >
              Update Request
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default EditRequest; 