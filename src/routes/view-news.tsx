import {
  Button,
  Collapse,
  Container,
  Divider,
  Heading,
  Link as ChakraLink,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import MarkdownIt from 'markdown-it';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { InscriptionMeta, OrdinalNews } from '../../lib/api-types';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

async function getInscriptionData(
  id: string
): Promise<(InscriptionMeta & OrdinalNews) | undefined> {
  const url = new URL('https://inscribe.news/');
  const info = await fetch(new URL(`/api/info/${id}`, url).toString());
  const content = await fetch(new URL(`/api/content/${id}`, url).toString());
  if (info.ok && content.ok) {
    const infoData = await info.json();
    const contentData = await content.json();
    return {
      ...infoData,
      ...contentData,
    };
  }
  console.log(`not ok: ${info.status} ${content.status}`);
  return undefined;
}

export default function ViewNews() {
  const md = new MarkdownIt();
  const { isOpen, onToggle } = useDisclosure();
  const query = useQuery();
  const id = query.get('id');
  const [data, setData] = useState<(InscriptionMeta & OrdinalNews) | undefined>(undefined);
  const [news, setNews] = useState<OrdinalNews | undefined>(undefined);

  useEffect(() => {
    if (id) {
      getInscriptionData(id).then(data => {
        console.log(`data: ${JSON.stringify(data)}`);
        if (data === undefined) return;
        setData(data);
        // extract news values as InscriptionMeta
        const { p, op, title, url, body, author, authorAddress, signature } = data;
        setNews({
          p,
          op,
          title,
          url,
          body,
          author,
          authorAddress,
          signature,
        });
      });
    }
  }, [id]);

  if (!id) {
    return (
      <Container>
        <Heading>No Inscription ID</Heading>
        <Text>Unable to load news inscription.</Text>
        <Text>Please provide the ID as a query parameter,</Text>
        <Link to="/">or click this link to return home.</Link>
      </Container>
    );
  }

  if (!data || !news) {
    return (
      <Container>
        <Heading>Unable to Load</Heading>
        <Text>Unable to load news inscription.</Text>
        <Text>ID: {id}</Text>
        <Link to="/">click this link to return home.</Link>
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
        <Text>ID: {data.id}</Text>
        <Text>Number: {data.number}</Text>
        <Text>Address: {data.address}</Text>
        <Text>Content Type: {data.content_type}</Text>
        <Text>Content Length: {data.content_length}</Text>
        <Text>Genesis Block Height: {data.genesis_block_height}</Text>
        <Text>Genesis TXID: {data.genesis_tx_id}</Text>
        <Text>Timestamp: {data.timestamp}</Text>
      </Collapse>
      <Button onClick={onToggle}>See Details</Button>
      <Heading>{news.title}</Heading>
      {news.url && (
        <Text>
          URL:{' '}
          <ChakraLink
            href={news.url}
            isExternal
          >
            {news.url}
          </ChakraLink>
        </Text>
      )}
      {news.author && <Text>By {news.author}</Text>}
      {news.authorAddress && <Text>Author Address: {news.authorAddress}</Text>}
      {news.signature && <Text>Signature: {news.signature}</Text>}
      {news.body && (
        <>
          <Divider
            orientation="horizontal"
            my={3}
          />
          <Text>{md.render(news.body)}</Text>
        </>
      )}
    </Container>
  );
}

// stats using info

// display reading with content
