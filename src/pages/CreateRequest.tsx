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
  Text,
  useColorModeValue,
  Card,
  CardBody,
  Container,
  FormErrorMessage,
} from '@chakra-ui/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CountrySelector from '../components/CountrySelector';
import LoadingState from '../components/LoadingState';
import { Country } from '../data/countries';

interface TransferRequest {
  amount: number;
  currency: string;
  fromCountry: string;
  fromCity: string;
  toCountry: string;
  toCity: string;
  name: string;
  phoneNumber: string;
  createdAt: Date;
  userId: string;
}

const CreateRequest = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [fromCountry, setFromCountry] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [toCity, setToCity] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a request",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const formattedNumber = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
      
      const request: TransferRequest = {
        amount: parseFloat(amount),
        currency,
        fromCountry,
        fromCity,
        toCountry,
        toCity,
        name,
        phoneNumber: formattedNumber,
        createdAt: new Date(),
        userId: user.uid,
      };

      await addDoc(collection(db, "transferRequests"), request);
      toast({
        title: "Success",
        description: "Transfer request created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "Error",
        description: "Failed to create transfer request. Please try again.",
        status: "error",
        duration: 5000,
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
    <Box minH="100vh" bg={bgColor} py={10} minW={'100vw'} display={'flex'} alignItems={'center'} justifyContent={'center'} p={10}>
      <Container maxW="container.sm">
        <Card bg={cardBg} boxShadow="lg">
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Heading color={headingColor} mb={2}>
                  Create Transfer Request
                </Heading>
                <Text color={textColor}>
                  Enter the amount and your phone number for the transfer
                </Text>
              </Box>

              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      size="lg"
                      min="1"
                      step="0.01"
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
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    width="full"
                    isLoading={isSubmitting}
                    isDisabled={!amount || !phoneNumber || !!error}
                  >
                    Create Request
                  </Button>
                </VStack>
              </form>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default CreateRequest; 