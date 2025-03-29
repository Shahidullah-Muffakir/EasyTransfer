import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Select,
} from "@chakra-ui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import CountrySelector from "../components/CountrySelector";
import { Country } from "../data/countries";

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

const EditRequest = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<TransferRequest | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [fromCountry, setFromCountry] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [toCity, setToCity] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "transferRequests", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as TransferRequest;
          setRequest({ ...data, id: docSnap.id });
          setAmount(data.amount.toString());
          setCurrency(data.currency);
          setFromCountry(data.fromCountry);
          setFromCity(data.fromCity);
          setToCountry(data.toCountry);
          setToCity(data.toCity);
          setName(data.name);
          setPhoneNumber(data.phoneNumber);
        } else {
          toast({
            title: "Error",
            description: "Transfer request not found.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          navigate("/");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch transfer request.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !request || request.userId !== user.uid) return;

    setIsSubmitting(true);
    try {
      const docRef = doc(db, "transferRequests", request.id);
      await updateDoc(docRef, {
        amount: parseFloat(amount),
        currency,
        fromCountry,
        fromCity,
        toCountry,
        toCity,
        name,
        phoneNumber,
      });

      toast({
        title: "Success",
        description: "Transfer request updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update transfer request.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  if (!request || request.userId !== user?.uid) {
    return <Box>You are not authorized to edit this request.</Box>;
  }

  return (
    <Box maxW="container.md" mx="auto" p={4}>
      <VStack spacing={8} align="stretch">
        <Heading>Edit Transfer Request</Heading>
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
              loadingText="Updating..."
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