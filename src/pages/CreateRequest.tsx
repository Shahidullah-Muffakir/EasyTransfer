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
import CountrySelector from '../components/CountrySelector';
import LoadingState from '../components/LoadingState';
import { Country } from '../data/countries';

const CreateRequest = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [fromCountry, setFromCountry] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [toCity, setToCity] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'transferRequests'), {
        amount: parseFloat(amount),
        currency,
        fromCountry,
        fromCity,
        toCountry,
        toCity,
        name,
        phoneNumber,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Success',
        description: 'Transfer request created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create transfer request.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingState message="Creating transfer request..." />;
  }

  return (
    <Box maxW="container.md" mx="auto" p={4}>
      <VStack spacing={8} align="stretch">
        <Heading>Create Transfer Request</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Currency</FormLabel>
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="INR">Indian Rupee (INR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="AFN">Afghan Afghani (AFN)</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>From Country</FormLabel>
              <CountrySelector
                value={fromCountry}
                onChange={(country: Country) => setFromCountry(country.code)}
                placeholder="Select source country"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>From City</FormLabel>
              <Input
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="Enter source city"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>To Country</FormLabel>
              <CountrySelector
                value={toCountry}
                onChange={(country: Country) => setToCountry(country.code)}
                placeholder="Select destination country"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>To City</FormLabel>
              <Input
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="Enter destination city"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Your Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Creating..."
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