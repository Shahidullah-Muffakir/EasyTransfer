import { useState, useRef, useEffect } from "react";
import {
  Box,
  Input,
  VStack,
  Text,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { countries, Country } from "../data/countries";

interface CountrySelectorProps {
  value: string;
  onChange: (country: Country) => void;
  placeholder?: string;
}

const CountrySelector = ({ value, onChange, placeholder = "Select a country" }: CountrySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const selectedCountry = countries.find((country) => country.code === value);

  useEffect(() => {
    if (selectedCountry) {
      setDisplayValue(`${selectedCountry.flag} ${selectedCountry.name}`);
    } else {
      setDisplayValue("");
    }
  }, [selectedCountry]);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    setIsOpen(true);
  };

  const handleCountrySelect = (country: Country) => {
    onChange(country);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <Box position="relative" ref={wrapperRef}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          ref={inputRef}
          value={isOpen ? searchQuery : displayValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            setSearchQuery("");
          }}
          placeholder={placeholder}
          readOnly={!isOpen}
        />
      </InputGroup>

      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          borderRadius="md"
          boxShadow="lg"
          maxH="300px"
          overflowY="auto"
          zIndex={1000}
        >
          <VStack spacing={0} align="stretch">
            {filteredCountries.map((country) => (
              <Box
                key={country.code}
                p={2}
                cursor="pointer"
                _hover={{ bg: hoverBg }}
                onClick={() => handleCountrySelect(country)}
              >
                <Text>
                  {country.flag} {country.name} ({country.code})
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default CountrySelector; 