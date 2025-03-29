import { useState } from 'react';
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
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateRequest = () => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [fromCountry, setFromCountry] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [currency, setCurrency] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [toCity, setToCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, 'transferRequests'), {
        name,
        amount: Number(amount),
        currency: currency.substring(0, 3),
        fromCountry,
        fromCity,
        toCountry,
        toCity,
        phoneNumber: user.phoneNumber,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Success',
        description: 'Your transfer request has been created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/');
    } catch (error) {
      console.log('error123', error)
      toast({
        title: 'Error',
        description: 'Failed to create transfer request. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="md" mx="auto">
      <VStack spacing={6} align="stretch">
        <Heading textAlign="center">Create Transfer Request</Heading>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
          <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="string"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Currency</FormLabel>
              <Input
                type="string"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="Enter currency"
                disabled={isSubmitting}
              />
            </FormControl>
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
              <FormLabel>From City</FormLabel>
              <Input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="Enter city name"
                disabled={isSubmitting}
              />
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
              Create Request
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default CreateRequest; 