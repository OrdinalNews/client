import { Box, Heading, Text, Link as ChakraLink, Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function RootIndex() {
  return (
    <Box
      borderRadius="xl"
      display="flex"
      flexDir="column"
    >
      <Image
        boxSize="150px"
        margin="0 auto"
        src="/ordinal-news-logo.png"
        alt="Ordinal News Logo"
      />
      <Heading>Ordinal News Standard</Heading>
      <Text
        fontSize="xl"
        mb={8}
      >
        Setting the standard for inscribing news on Bitcoin.
      </Text>
      <Box
        display="flex"
        flexDir={['column', 'column', 'row']}
        alignContent="center"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          as={Link}
          to="/post-news"
          className="link-button"
          me={[0, 0, 8]}
          mb={[8, 8, 0]}
          w={['fit-content', '75%', 'auto']}
        >
          Inscribe the News
        </Button>
        <Button
          as={ChakraLink}
          href="https://docs.inscribe.news"
          className="link-button"
          isExternal
          w={['fit-content', '75%', 'auto']}
        >
          Read the Docs
        </Button>
      </Box>
    </Box>
  );
}
