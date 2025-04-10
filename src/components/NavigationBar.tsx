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
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";

const NavigationBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.700", "white");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const drawerBg = useColorModeValue("white", "gray.800");
  const drawerHeaderBg = useColorModeValue("gray.50", "gray.700");
  const drawerBorderColor = useColorModeValue("gray.200", "gray.700");

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const NavLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
    <Button
      variant="ghost"
      onClick={() => {
        navigate(to);
        onClose();
      }}
      width="full"
      justifyContent="flex-start"
      height="48px"
      fontSize="md"
      fontWeight="medium"
      _hover={{ 
        bg: hoverBg,
        transform: "translateX(4px)",
        transition: "all 0.2s",
      }}
      _active={{ bg: hoverBg }}
      px={4}
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
      bg={drawerBg}
      borderBottom="1px"
      borderColor={drawerBorderColor}
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
              bg={drawerBg}
              borderColor={drawerBorderColor}
              _hover={{ 
                bg: hoverBg,
                borderColor: "brand.500",
                color: "brand.500"
              }}
              _active={{ bg: hoverBg }}
              leftIcon={<Avatar size="sm" name={user.displayName || user.email || "User"} src={user.photoURL || undefined} />}
              justifyContent="flex-start"
              px={4}
            >
              {user.displayName || user.email || "User"}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/create")}>
                Create Request
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
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
        bg={drawerBg}
        borderColor={drawerBorderColor}
        _hover={{ 
          bg: hoverBg,
          borderColor: "brand.500",
          color: "brand.500"
        }}
        _active={{ bg: hoverBg }}
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
            SimpleTransfer 
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
                  variant="ghost"
                  leftIcon={<Avatar size="sm" name={user.displayName || user.email || undefined} src={user.photoURL || undefined} />}
                >
                  {user.displayName || user.email || "User"}
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
      {/* <MobileNav /> */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent bg={drawerBg}>
          <DrawerCloseButton size="lg" />
          <DrawerHeader 
            borderBottomWidth="1px" 
            bg={drawerHeaderBg}
            borderColor={drawerBorderColor}
            py={4}
          >
            <Flex align="center" gap={3}>
              <Avatar 
                size="md" 
                name={user?.displayName || user?.email || "User"} 
                src={user?.photoURL || undefined}
                borderWidth={2}
                borderColor="brand.500"
              />
              <Box>
                <Text fontSize="lg" fontWeight="bold" color={headingColor}>
                  {user?.displayName || user?.email || "User"}
                </Text>
                <Text fontSize="sm" color={textColor}>
                  {user ? "Welcome back!" : "Please login"}
                </Text>
              </Box>
            </Flex>
          </DrawerHeader>
          <DrawerBody py={4}>
            <VStack spacing={2} align="stretch">
              <NavLink to="/">
                <HStack>
                  <Text>Home</Text>
                </HStack>
              </NavLink>
              {user && (
                <NavLink to="/create">
                  <HStack>
                    <AddIcon />
                    <Text>Create Request</Text>
                  </HStack>
                </NavLink>
              )}
              {user ? (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  width="full"
                  justifyContent="flex-start"
                  height="48px"
                  fontSize="md"
                  fontWeight="medium"
                  _hover={{ 
                    bg: hoverBg,
                    transform: "translateX(4px)",
                    transition: "all 0.2s",
                  }}
                  _active={{ bg: hoverBg }}
                  px={4}
                  color="red.500"
                >
                  Logout
                </Button>
              ) : (
                <NavLink to="/login">
                  <HStack>
                    <Text>Login</Text>
                  </HStack>
                </NavLink>
              )}
              <Box mt={4} pt={4} borderTopWidth="1px" borderColor={drawerBorderColor}>
                <Button
                  variant="ghost"
                  onClick={toggleColorMode}
                  width="full"
                  justifyContent="flex-start"
                  height="48px"
                  fontSize="md"
                  fontWeight="medium"
                  _hover={{ 
                    bg: hoverBg,
                    transform: "translateX(4px)",
                    transition: "all 0.2s",
                  }}
                  _active={{ bg: hoverBg }}
                  px={4}
                >
                  <HStack>
                    {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                    <Text>Toggle {colorMode === "light" ? "Dark" : "Light"} Mode</Text>
                  </HStack>
                </Button>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default NavigationBar; 