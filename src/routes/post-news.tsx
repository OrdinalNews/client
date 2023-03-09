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
  Icon,
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

// credit for the bitcoin icon
// https://commons.wikimedia.org/wiki/File:Bitcoin_logo.svg#/media/File:Bitcoin.svg
const BitcoinIcon = () => (
  <Icon
    viewBox="0 0 64 64"
    className="bitcoin-icon"
  >
    <g transform="translate(0.00630876,-0.00301984)">
      <path
        fill="currentColor"
        d="m63.033,39.744c-4.274,17.143-21.637,27.576-38.782,23.301-17.138-4.274-27.571-21.638-23.295-38.78,4.272-17.145,21.635-27.579,38.775-23.305,17.144,4.274,27.576,21.64,23.302,38.784z"
      />
      <path
        fill="#FFF"
        d="m46.103,27.444c0.637-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-0.875-1.4,5.616c-0.923-0.23-1.871-0.447-2.813-0.662l1.41-5.653-3.509-0.875-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018-4.842-1.209-0.934,3.75s2.605,0.597,2.55,0.634c1.422,0.355,1.679,1.296,1.636,2.042l-1.638,6.571c0.098,0.025,0.225,0.061,0.365,0.117-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205c-0.174,0.432-0.615,1.08-1.609,0.834,0.035,0.051-2.552-0.637-2.552-0.637l-1.743,4.019,4.569,1.139c0.85,0.213,1.683,0.436,2.503,0.646l-1.453,5.834,3.507,0.875,1.439-5.772c0.958,0.26,1.888,0.5,2.798,0.726l-1.434,5.745,3.511,0.875,1.453-5.823c5.987,1.133,10.489,0.676,12.384-4.739,1.527-4.36-0.076-6.875-3.226-8.515,2.294-0.529,4.022-2.038,4.483-5.155zm-8.022,11.249c-1.085,4.36-8.426,2.003-10.806,1.412l1.928-7.729c2.38,0.594,10.012,1.77,8.878,6.317zm1.086-11.312c-0.99,3.966-7.1,1.951-9.082,1.457l1.748-7.01c1.982,0.494,8.365,1.416,7.334,5.553z"
      />
    </g>
  </Icon>
);

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
        borderRadius="xl"
        display="flex"
        flexDir="column"
        w="100%"
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
              <Heading>Ready to Inscribe</Heading>
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
                  className="link-button"
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
                  className="link-button"
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
                  className="link-button"
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
                  className="link-button"
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
