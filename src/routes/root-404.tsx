import { Box, Container, Heading, Image, Text } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

export default function Root404() {
  const location = useLocation();
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
      <Heading>404 - not found!</Heading>
      <Text>We couldn't find that page.</Text>
      <br />
      <Text>Current location: {location.pathname}</Text>
      <br />
      <Text>
        Please try a different page or <Link to="/">click this link to return home.</Link>
      </Text>
    </Box>
  );
}
