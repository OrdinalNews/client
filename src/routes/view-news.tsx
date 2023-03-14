import { Button, Collapse, Container, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getInscription } from '../../lib/api-helpers';
import { Env } from '../../lib/api-types';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ViewNews() {
  const { isOpen, onToggle } = useDisclosure();
  const query = useQuery();
  const id = query.get('id');

  if (!id) {
    return (
      <Container>
        <Heading>No ID Specified</Heading>
        <Text>Unable to load news inscription.</Text>
        <Text>
          Please provide the ID as a query parameter, or{' '}
          <Link to="/">click this link to return home.</Link>
        </Text>
      </Container>
    );
  }

  return (
    <Container
      display="flex"
      flexDir="column"
    >
      <Collapse
        in={isOpen}
        animateOpacity
      >
        <Heading>Info</Heading>
        <Text>Details</Text>
      </Collapse>
      <Button onClick={onToggle}>See Details</Button>
      <Heading>Title</Heading>
      <Text>ID: {id}</Text>
    </Container>
  );
}

// stats using info

// display reading with content
