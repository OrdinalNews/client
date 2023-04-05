import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  Code,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useControllableState,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import BitcoinIcon from '../components/bitcoin-icon';

// credit for the form template goes to:
// https://chakra-templates.dev/templates/forms/authentication/simpleSignupCard
export default function PostNews() {
  const [title, setTitle] = useControllableState({ defaultValue: '' });
  const [url, setUrl] = useControllableState({ defaultValue: '' });
  const [body, setBody] = useControllableState({ defaultValue: '' });
  const [author, setAuthor] = useControllableState({ defaultValue: '' });
  const [finalPost, setFinalPost] = useControllableState({ defaultValue: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const copyText = () => {
    if (!finalPost || finalPost.length === 0) {
      toast({
        title: 'No data to copy',
        status: 'error',
        duration: 3000,
        isClosable: true,
        variant: 'left-accent',
      });
      return;
    }
    const copyStatus = copy(finalPost);
    if (copyStatus) {
      toast({
        title: `Copied ordinal news to clipboard`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        variant: 'left-accent',
      });
      return;
    }
    toast({
      title: `Unable to copy to clipboard`,
      status: 'error',
      duration: 3000,
      isClosable: true,
      variant: 'left-accent',
    });
  };

  const generatePost = () => {
    if (title.length === 0) {
      toast({
        title: 'Title is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
        variant: 'left-accent',
      });
      return;
    }

    if (url.length === 0 && body.length === 0) {
      toast({
        title: 'One of a URL or Body is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
        variant: 'left-accent',
      });
      return;
    }

    const postObject = {
      p: 'ons',
      op: 'post',
      title,
      ...(url.length > 0 && { url }),
      ...(author.length > 0 && { author }),
      ...(body.length > 0 && { body }),
    };

    setFinalPost(JSON.stringify(postObject, null, 2));

    onOpen();
  };

  return (
    <>
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        w="100%"
        minH="100vh"
        py={8}
        px={4}
      >
        <Stack
          align={'center'}
          mb={8}
        >
          <Heading
            fontSize={'4xl'}
            textAlign={'center'}
          >
            Inscribe the News
          </Heading>
          <Text
            fontSize={'lg'}
            color={'gray.600'}
          >
            on Bitcoin, forever <BitcoinIcon />
          </Text>
        </Stack>
        <Box
          rounded={'3xl'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'dark-lg'}
          p={8}
          mb={8}
          mx="auto"
          w="100%"
          maxW="xl"
        >
          <Stack spacing={4}>
            <FormControl
              id="title"
              isRequired
            >
              <FormLabel fontSize={['sm', 'sm', 'xl']}>Title</FormLabel>
              <Input
                type="text"
                placeholder="The main headline"
                fontSize={['xs', 'sm', 'xl']}
                onChange={e => setTitle(e.target.value.trim())}
              />
            </FormControl>
            <FormControl id="url">
              <FormLabel fontSize={['sm', 'sm', 'xl']}>URL</FormLabel>
              <Input
                type="url"
                placeholder="Add a link (optional)"
                fontSize={['xs', 'sm', 'xl']}
                onChange={e => setUrl(e.target.value.trim())}
              />
            </FormControl>
            <FormControl id="author">
              <FormLabel fontSize={['sm', 'sm', 'xl']}>Author</FormLabel>
              <Input
                type="text"
                placeholder="Add an author (optional)"
                fontSize={['xs', 'sm', 'xl']}
                onChange={e => setAuthor(e.target.value.trim())}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize={['sm', 'sm', 'xl']}>Body</FormLabel>
              <Textarea
                resize="vertical"
                placeholder="Plain text or markdown (optional)"
                fontSize={['xs', 'sm', 'xl']}
                onChange={e => setBody(e.target.value.trim())}
              />
            </FormControl>
            <Stack
              spacing={10}
              pt={2}
            >
              <Button
                loadingText="Submitting"
                size="lg"
                onClick={generatePost}
                borderRadius="xl"
              >
                Generate
              </Button>
            </Stack>
          </Stack>
        </Box>
        <Link to="/">Back Home</Link>
      </Box>
      <Box w="100%">
        <Modal
          allowPinchZoom
          autoFocus
          onClose={onClose}
          isOpen={isOpen}
          size={['full', 'full', 'xl']}
          scrollBehavior="inside"
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Heading>Ready to Inscribe!</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDir="column"
            >
              <Code
                display="block"
                whiteSpace="pre-wrap"
                px={2}
                mb={6}
                children={finalPost}
              ></Code>
              <Box
                display="flex"
                flexDir={['column-reverse', 'row']}
                alignContent="center"
                alignItems="space-between"
                justifyContent="space-between"
                mb={6}
              >
                <Text>
                  You can upload an inscription using ord or through a service that supports text
                  inscriptions.
                </Text>
                <Button
                  mx={3}
                  mb={[6, 0]}
                  whiteSpace="nowrap"
                  onClick={copyText}
                  minW="fit-content"
                  borderRadius="xl"
                >
                  Copy to Clipboard
                </Button>
              </Box>
              <Alert
                status="warning"
                flexShrink={0}
              >
                <AlertIcon />
                <AlertDescription>
                  Remember,{' '}
                  <Text
                    as="b"
                    title="Do Your Own Research"
                  >
                    always DYOR
                  </Text>{' '}
                  before using a tool or service!
                </AlertDescription>
              </Alert>
              <ButtonGroup
                spacing={[0, 0, 6]}
                my={6}
                flexDir={['column', 'column', 'row']}
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  borderRadius="xl"
                  as={ChakraLink}
                  href="https://gamma.io/ordinals"
                  isExternal
                  className="button-link-hack"
                  minW={['100%', '75%', 'fit-content']}
                  mb={[6, 6, 0]}
                >
                  Gamma
                </Button>
                <Button
                  borderRadius="xl"
                  as={ChakraLink}
                  href="https://ordinalsbot.com/"
                  isExternal
                  className="button-link-hack"
                  minW={['100%', '75%', 'fit-content']}
                  mb={[6, 6, 0]}
                >
                  OrdinalsBot
                </Button>
                <Button
                  borderRadius="xl"
                  as={ChakraLink}
                  href="https://ordimint.com"
                  isExternal
                  className="button-link-hack"
                  minW={['100%', '75%', 'fit-content']}
                  mb={[6, 6, 0]}
                >
                  Ordimint
                </Button>
                <Button
                  borderRadius="xl"
                  as={ChakraLink}
                  href="https://unisat.io/inscribe"
                  isExternal
                  className="button-link-hack"
                  minW={['100%', '75%', 'fit-content']}
                >
                  UniSat
                </Button>
              </ButtonGroup>
              <Text mb={6}>
                Use the "plain text" inscription type if you're using a service, or make sure the
                file's type is `.txt` if using the Ordinals CLI.
              </Text>
              <Text>
                See the{' '}
                <ChakraLink
                  href="https://github.com/neu-fi/awesome-ordinals"
                  isExternal
                >
                  Ordinals Awesome List
                </ChakraLink>{' '}
                for even more inscription services.{' '}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                onClick={onClose}
                size="md"
                borderRadius="xl"
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
