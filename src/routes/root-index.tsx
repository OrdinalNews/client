import { Box, Heading, Text, Link as ChakraLink, Image, Button, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function RootIndex() {
  return (
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
      <Image
        boxSize="150px"
        margin="0 auto"
        src="/ordinal-news-logo.png"
        alt="Ordinal News Logo"
        mb={4}
      />
      <Heading>Ordinal News Standard</Heading>
      <Text
        fontSize="xl"
        mb={8}
      >
        Permanently inscribe news and topics of discussion to Bitcoin.
      </Text>
      <Stack
        direction={['column', 'column', 'row']}
        spacing={8}
      >
        <Button
          as={Link}
          className="button-link-hack"
          to="/post-news"
        >
          Inscribe the News
        </Button>
        <Button
          as={ChakraLink}
          className="button-link-hack"
          href="https://docs.inscribe.news"
          isExternal
        >
          Read the Docs
        </Button>
      </Stack>
    </Box>
  );
}
