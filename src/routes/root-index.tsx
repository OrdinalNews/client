import { Box, Heading, Text, Link as ChakraLink, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function RootIndex() {
  return (
    <Box borderRadius="xl">
      <Image
        boxSize="150px"
        margin="0 auto"
        src="/ordinal-news-logo.png"
        alt="Ordinal News Logo"
      />
      <Heading>Ordinal News Standard</Heading>

      <Text fontSize="xl">Setting the standard for inscribing news on Bitcoin.</Text>
      <br />
      <Text>
        <Link to="/post-news">Inscribe the News</Link> |{' '}
        <ChakraLink
          href="https://docs.inscribe.news"
          isExternal
        >
          Read the Docs
        </ChakraLink>
      </Text>
    </Box>
  );
}
