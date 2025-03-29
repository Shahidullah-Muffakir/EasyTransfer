import {
  Box,
  Flex,
  Button,
  useDisclosure,
  IconButton,
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AddIcon } from "@chakra-ui/icons";

const NavigationBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.700", "white");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const NavLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
    <Button
      as={RouterLink}
      to={to}
      variant="ghost"
      color={textColor}
      _hover={{ color: "brand.500" }}
      fontWeight="medium"
    >
      {children}
    </Button>
  );

  const MobileNav = () => (
    <VStack
      display={{ base: isOpen ? "flex" : "none", md: "none" }}
      position="fixed"
      top="60px"
      left="0"
      right="0"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      p={4}
      spacing={4}
      zIndex={100}
    >
      {/* <NavLink to="/">Home</NavLink> */}
      {user ? (
        <>
          <Button
            as={RouterLink}
            to="/create"
            leftIcon={<AddIcon />}
            colorScheme="brand"
            width="full"
          >
            Create Request
          </Button>
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              width="full"
              leftIcon={<Avatar size="sm" name={user.phoneNumber || undefined} />}
            >
              {user.phoneNumber || "User"}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </>
      ) : (
        <Button as={RouterLink} to="/login" colorScheme="brand" width="full">
          Login
        </Button>
      )}
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="ghost"
        width="full"
      />
    </VStack>
  );

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={100}
      boxShadow="sm"
    >
      <Flex
        h="60px"
        alignItems="center"
        justifyContent="space-between"
        maxW="container.xl"
        mx="auto"
        px={4}
      >
        <Flex alignItems="center">
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={headingColor}
            as={RouterLink}
            to="/"
            _hover={{ color: "brand.500" }}
          >
            MoneyTransfer
          </Text>
        </Flex>

        {/* Desktop Navigation */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          {/* <NavLink to="/">Home</NavLink> */}
          {user ? (
            <>
              <Button
                as={RouterLink}
                to="/create"
                leftIcon={<AddIcon />}
                colorScheme="brand"
              >
                Create Request
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  leftIcon={<Avatar size="sm" name={user.phoneNumber || undefined} />}
                >
                  {user.phoneNumber || "User"}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Button as={RouterLink} to="/login" colorScheme="brand">
              Login
            </Button>
          )}
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </HStack>

        {/* Mobile Navigation Button */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
          variant="ghost"
          aria-label="Toggle Navigation"
        />
      </Flex>

      {/* Mobile Navigation Menu */}
      <MobileNav />
    </Box>
  );
};

export default NavigationBar; 