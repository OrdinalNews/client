import { useEffect, useState } from 'react';
import { Heading, HStack, Text } from '@chakra-ui/react';
import { KVNamespaceListResult } from '@cloudflare/workers-types';
import { InscriptionMeta, OrdinalNews } from '../../lib/api-types';
import { Link } from 'react-router-dom';
import StatsCard from '../components/stats-card';

// const apiUrl = new URL('https://inscribe.news/');
const apiUrl = new URL('https://fix-recent-news.ordinal-news-client.pages.dev/');

async function getRecentNews() {
  const result = await fetch(new URL(`/api/data/ord-news`, apiUrl).toString());
  if (result.ok) {
    const infoData: KVNamespaceListResult<unknown, string> = await result.json();
    return infoData;
  }
  console.log(`getRecentNews: ${result.status}`);
  return undefined;
}

async function getNewsData(id: string) {
  const news = await fetch(new URL(`/api/data/${id}`, apiUrl).toString());
  if (news.ok) {
    console.log(`news: ${typeof news}`);
    console.log(`news: ${JSON.stringify(news)}`);
    const newsData: InscriptionMeta & OrdinalNews = await news.json();
    return newsData;
  }
  console.log(`getNewsData: ${news.status}`);
  return undefined;
}

function NewsItem(props: InscriptionMeta & OrdinalNews) {
  const { id, number, timestamp, title, author } = props;
  return (
    <HStack
      my={3}
      alignItems="stretch"
    >
      <StatsCard
        title={undefined}
        stat={<Link to={`/view-news?id=${id}`}>{title}</Link>}
      />
      <StatsCard
        title="News #"
        stat="coming soon"
      />
      <StatsCard
        title="Inscription #"
        stat={number.toLocaleString()}
      />
      <StatsCard
        title="Author"
        stat={author ? author : 'anonymous'}
      />
      <StatsCard
        title="Timestamp"
        stat={new Date(timestamp).toLocaleString()}
      />
    </HStack>
  );
}

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
          const newsList = data.keys.map((key: any) => key.name);
          console.log(`newsList: ${JSON.stringify(newsList)}`);
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
      console.log(`newsList: ${JSON.stringify(newsList)}`);
      for (const newsId of newsList) {
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
          })
          .catch(err => {
            console.log(`getNewsData: ${err}`);
          });
      }
      setLoading(false);
    }
  }, [newsList]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!newsList || !newsData) {
    return <Text>Failed to load news.</Text>;
  }

  return (
    <>
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
    </>
  );
}
