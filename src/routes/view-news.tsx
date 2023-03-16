import {
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Heading,
  Link as ChakraLink,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { InscriptionMeta, OrdinalNews } from '../../lib/api-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import StatsCard from '../components/stats-card';

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
  console.log(`getInscriptionData err: ${info.status} ${content.status}`);
  return undefined;
}

export default function ViewNews() {
  const { isOpen, onToggle } = useDisclosure();
  const query = useQuery();
  const id = query.get('id');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<(InscriptionMeta & OrdinalNews) | undefined>(undefined);
  const [news, setNews] = useState<OrdinalNews | undefined>(undefined);

  useEffect(() => {
    if (id) {
      getInscriptionData(id).then(data => {
        setLoading(false);
        if (data === undefined) return;
        setData(data);
        // extract news values as InscriptionMeta
        const { p, op, title, url, body, author, authorAddress, signature } = data;
        // TODO: fix for SNS names coming up in view-news
        if (p === 'ons' && title) {
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
        }
      });
    }
  }, [id]);

  if (!id) {
    return (
      <Container>
        <Heading>No Inscription ID</Heading>
        <Text>Unable to load news inscription.</Text>
        <Text>Please provide the ID as a query parameter, or</Text>
        <Link to="/">Click this link to return home.</Link>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Heading>Loading inscription data...</Heading>
        <Text>ID: {id}</Text>
      </Container>
    );
  }

  if (!data || !news) {
    return (
      <Container>
        <Heading>Unable to Load</Heading>
        <Text>Unable to load news inscription.</Text>
        <Text>ID: {id}</Text>
        <Link to="/">Click this link to return home.</Link>
      </Container>
    );
  }

  return (
    <Container
      display="flex"
      flexDir="column"
      textAlign="left"
      minH="100vh"
      maxW="800px"
    >
      <Heading lineHeight={1}>{news.title}</Heading>
      <Box
        display="flex"
        flexDir={['column', 'column', 'row']}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box
          display="flex"
          flexDir="column"
          justifyContent="space-between"
          maxW="100%"
          pt={3}
        >
          {news.author && <Text pb={3}>Author: {news.author}</Text>}
          {news.url && (
            <Text pb={3}>
              URL:{' '}
              <ChakraLink
                href={news.url}
                isExternal
              >
                {news.url}
              </ChakraLink>
            </Text>
          )}
        </Box>
        <Button
          ms={3}
          mb={3}
          minW="fit-content"
          onClick={onToggle}
        >
          See Details
        </Button>
      </Box>
      <Collapse
        in={isOpen}
        animateOpacity
      >
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={{ base: 5, lg: 8 }}
          mt={3}
        >
          <StatsCard
            title="Inscription ID"
            stat={data.id}
          />
          <StatsCard
            title="Inscription #"
            stat={data.number}
          />
          <StatsCard
            title="Address"
            stat={data.address}
          />
          <StatsCard
            title="Content Type"
            stat={data.content_type}
          />
          <StatsCard
            title="Content Length"
            stat={data.content_length}
          />
          <StatsCard
            title="Block Height"
            stat={data.genesis_block_height}
          />
          <StatsCard
            title="Genesis TXID"
            stat={data.genesis_tx_id}
          />
          <StatsCard
            title="Timestamp"
            stat={data.timestamp}
          />
          {news.authorAddress && (
            <StatsCard
              title="Author Address"
              stat={news.authorAddress}
            />
          )}
          {news.signature && (
            <StatsCard
              title="Author Signature"
              stat={news.signature}
            />
          )}
        </SimpleGrid>
      </Collapse>
      {news.body && (
        <>
          <Divider
            orientation="horizontal"
            my={3}
          />
          <ReactMarkdown
            components={ChakraUIRenderer()}
            children={news.body}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            className="ord-news"
            linkTarget="_blank"
          ></ReactMarkdown>
        </>
      )}
    </Container>
  );
}
