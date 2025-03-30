import {
  Box,
  VStack,
  HStack,
  Text,
  Textarea,
  Button,
  useToast,
  Avatar,
  useColorModeValue,
  Divider,
  IconButton,
  Tooltip,
  useDisclosure,
  Collapse,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { formatDistanceToNow } from "date-fns";
import {
  ChatIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
} from "@chakra-ui/icons";

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: any;
}

interface CommentsProps {
  requestId: string;
}

const Comments = ({ requestId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const commentBg = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("requestId", "==", requestId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [requestId]);
  console.log("commnets123", comments);

  const handleSubmit = async () => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, "comments"), {
        text: newComment.trim(),
        requestId,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL || undefined,
        createdAt: serverTimestamp(),
      });

      setNewComment("");
      toast({
        title: "Success",
        description: "Comment posted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commendId: string) => {
    if (!commendId || !user) {
      return;
    }
    try {
      await deleteDoc(doc(db, "comments", commendId));
      toast({
        title: "Success",
        description: "Comment deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <HStack
        justify="space-between"
        mb={4}
        cursor="pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        _hover={{ color: "brand.500" }}
      >
        <HStack>
          <ChatIcon />
          <Text fontWeight="medium">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </Text>
        </HStack>
        <IconButton
          aria-label={isExpanded ? "Collapse comments" : "Expand comments"}
          icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        />
      </HStack>

      <Collapse in={isExpanded}>
        <VStack spacing={4} align="stretch">
          <Box>
            <Textarea
              placeholder={user ? "Write a comment..." : "Login to comment"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              size="sm"
              resize="none"
              rows={2}
              bg={bgColor}
              borderColor={borderColor}
              _hover={{ borderColor: "brand.500" }}
              _focus={{ borderColor: "brand.500" }}
              // isDisabled={!user}
            />
            <HStack justify="flex-end" mt={2}>
              <Button
                size="sm"
                colorScheme="brand"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!newComment.trim()}
                leftIcon={<ChatIcon />}
              >
                {user ? "Post Comment" : "Login to Comment"}
              </Button>
            </HStack>
          </Box>

          <Divider />

          <VStack spacing={4} align="stretch">
            {comments.map((comment) => (
              <Box
                key={comment.id}
                p={3}
                bg={commentBg}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{ bg: hoverBg }}
                transition="all 0.2s"
              >
                <HStack spacing={3} align="start">
                  <Avatar
                    size="sm"
                    name={comment.userName}
                    src={comment.userPhoto}
                  />
                  <Box flex={1}>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">{comment.userName}</Text>
                      {user?.uid === comment.userId && (
                        <IconButton
                          aria-label="Delete comment"
                          icon={<DeleteIcon />}
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                        />
                      )}
                    </HStack>
                    <Tooltip
                      label={comment.createdAt?.toDate().toLocaleString()}
                    >
                      <Text fontSize="sm" color={textColor}>
                        {comment.createdAt &&
                          formatDistanceToNow(comment.createdAt.toDate(), {
                            addSuffix: true,
                          })}
                      </Text>
                    </Tooltip>
                    <Text mt={1} color={textColor} whiteSpace="pre-wrap">
                      {comment.text}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            ))}
            {comments.length === 0 && (
              <Text color={textColor} textAlign="center" py={4}>
                No comments yet. Be the first to comment!
              </Text>
            )}
          </VStack>
        </VStack>
      </Collapse>
    </Box>
  );
};

export default Comments;
