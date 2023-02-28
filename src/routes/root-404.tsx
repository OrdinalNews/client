import { Container, Heading, Text } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

export default function Root404() {
  const location = useLocation();
  return (
    <Container borderRadius="xl">
      <Heading>404 - not found!</Heading>
      <Text>We couldn't find that page.</Text>
      <Text>
        Please try a different page or <Link to="/">click this link to return home.</Link>
      </Text>
      <Text>Current location: {location.pathname}</Text>
    </Container>
  );
}
