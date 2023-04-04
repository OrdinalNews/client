import { useEffect, useState } from 'react';
import { Box, Divider, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { KVNamespaceListKey, KVNamespaceListResult } from '@cloudflare/workers-types';
import { InscriptionMeta, OrdinalNews } from '../../lib/api-types';
import { Link } from 'react-router-dom';

const apiUrl = new URL('https://inscribe.news/');

async function getRecentNews() {
  const result = await fetch(new URL(`/api/data/ord-news`, apiUrl).toString());
  if (result.ok) {
    const infoData: KVNamespaceListResult<unknown, string> = await result.json();
    return infoData;
  }
  console.log(`getRecentNews: ${result.status} ${result.statusText}`);
  return undefined;
}

async function getNewsData(id: string) {
  const news = await fetch(new URL(`/api/data/${id}`, apiUrl).toString());
  if (news.ok) {
    //console.log(`news: ${typeof news}`);
    //console.log(`news: ${JSON.stringify(news)}`);
    const newsData: InscriptionMeta & OrdinalNews = await news.json();
    return newsData;
  }
  console.log(`getNewsData: ${news.status} ${news.statusText}`);
  return undefined;
}

function NewsItem(props: InscriptionMeta & OrdinalNews) {
  const { number, timestamp, title, author } = props;
  return (
    <VStack
      alignItems="flex-start"
      w="100%"
      maxW={1200}
      py={4}
    >
      <Heading
        size="md"
        textAlign="left"
      >
        <Link
          className="link-wrap-hack"
          to={`/view-news?id=${number}`}
        >
          {title}
        </Link>
      </Heading>
      <HStack flexWrap="wrap">
        <Text>{new Date(timestamp).toLocaleString()}</Text>
        <Text>•</Text>
        <Text>Inscription # {number.toLocaleString()}</Text>
        <Text>•</Text>
        <Text>{author ? author : 'anonymous'}</Text>
      </HStack>
      <Divider />
    </VStack>
  );
}

/*
<Text>•</Text>
<Text>News # 005</Text>
*/

export default function RecentNews() {
  const [loading, setLoading] = useState(true);
  const [newsList, setNewsList] = useState<string[] | undefined>(undefined);
  const [newsData, setNewsData] = useState<(InscriptionMeta & OrdinalNews)[] | undefined>(
    undefined
  );

  useEffect(() => {
    getRecentNews()
      .then(data => {
        if (data) {
          const newsList = data.keys.map((key: KVNamespaceListKey<unknown, string>) => key.name);
          setNewsList(newsList);
        }
      })
      .catch(err => {
        console.log(`getRecentNews: ${err}`);
        setNewsList(undefined);
      });
  }, []);

  useEffect(() => {
    if (newsList && newsList.length > 0) {
      const processedNewsIds = new Set();
      for (const newsId of newsList) {
        if (!processedNewsIds.has(newsId)) {
          processedNewsIds.add(newsId);
          getNewsData(newsId)
            .then(data => {
              if (data) {
                setNewsData(prev => {
                  if (prev) {
                    return [...prev, data];
                  }
                  return [data];
                });
              }
              setLoading(false);
            })
            .catch(err => {
              console.log(`getNewsData: ${err}`);
              setLoading(false);
            });
        }
      }
    }
  }, [newsList]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        textAlign="left"
        w="100%"
        minH="100vh"
        py={8}
        px={4}
      >
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (!newsList || !newsData) {
    return (
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        textAlign="left"
        w="100%"
        minH="100vh"
        py={8}
        px={4}
      >
        <Text>Failed to load news.</Text>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      textAlign="left"
      w="100%"
      minH="100vh"
      py={8}
      px={4}
    >
      <Heading>News Feed</Heading>
      <Text>
        Detected {newsList.length} news inscription{newsList.length > 1 ? 's' : null}
      </Text>
      {newsData
        .sort((a, b) => {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return dateB.getTime() - dateA.getTime();
        })
        .map((news, i) => (
          <NewsItem
            key={i}
            {...news}
          />
        ))}
    </Box>
  );
}
