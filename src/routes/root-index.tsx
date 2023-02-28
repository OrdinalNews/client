import { Box, Heading, ListItem, Text, UnorderedList, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
export default function RootIndex() {
  return (
    <Box borderRadius="xl">
      <Heading>Welcome!</Heading>

      <Text>Cool stuff coming soon.</Text>
      <br />
      <ChakraLink
        href="https://docs.inscribe.news"
        isExternal
      >
        Read the Documentation
      </ChakraLink>
      <br />
      <br />
      <Link to="/post">Inscribe the News</Link>
      <br />
      <br />
      <Text>
        Read the News <Text as={'i'}>(coming soon)</Text>
      </Text>
    </Box>
  );
}
