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
  const mobileMenuBg = useColorModeValue("white", "gray.800");
  const mobileButtonBg = useColorModeValue("white", "gray.800");
  const mobileButtonHoverBg = useColorModeValue("gray.50", "gray.700");
  const mobileButtonActiveBg = useColorModeValue("gray.100", "gray.600");
  const mobileButtonBorder = useColorModeValue("gray.200", "gray.700");

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
      bg={mobileMenuBg}
      borderBottom="1px"
      borderColor={borderColor}
      p={4}
      spacing={3}
      zIndex={100}
      boxShadow="md"
    >
      {user ? (
        <>
          <Button
            as={RouterLink}
            to="/create"
            leftIcon={<AddIcon />}
            colorScheme="brand"
            width="full"
            size="lg"
            height="48px"
            fontSize="md"
            fontWeight="medium"
            _hover={{
              transform: "translateY(-1px)",
              boxShadow: "md",
            }}
            _active={{
              transform: "translateY(0)",
            }}
          >
            Create Request
          </Button>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              width="full"
              height="48px"
              fontSize="md"
              fontWeight="medium"
              bg={mobileButtonBg}
              borderColor={mobileButtonBorder}
              _hover={{ 
                bg: mobileButtonHoverBg,
                borderColor: "brand.500",
                color: "brand.500"
              }}
              _active={{ bg: mobileButtonActiveBg }}
              leftIcon={<Avatar size="sm" name={user.phoneNumber || undefined} />}
              justifyContent="flex-start"
              px={4}
            >
              {user.phoneNumber || "User"}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </>
      ) : (
        <Button
          as={RouterLink}
          to="/login"
          colorScheme="brand"
          width="full"
          size="lg"
          height="48px"
          fontSize="md"
          fontWeight="medium"
          _hover={{
            transform: "translateY(-1px)",
            boxShadow: "md",
          }}
          _active={{
            transform: "translateY(0)",
          }}
        >
          Login
        </Button>
      )}
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="outline"
        width="full"
        height="48px"
        fontSize="md"
        fontWeight="medium"
        bg={mobileButtonBg}
        borderColor={mobileButtonBorder}
        _hover={{ 
          bg: mobileButtonHoverBg,
          borderColor: "brand.500",
          color: "brand.500"
        }}
        _active={{ bg: mobileButtonActiveBg }}
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
            EasyTransfer 💸
          </Text>
        </Flex>

        {/* Desktop Navigation */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
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