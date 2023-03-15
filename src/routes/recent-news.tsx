import { useEffect, useState } from 'react';
import { Heading, HStack, Text } from '@chakra-ui/react';
import { InscriptionMeta, OrdinalNews } from '../../lib/api-types';
import { Link } from 'react-router-dom';
import StatsCard from '../components/stats-card';

const apiUrl = new URL('https://inscribe.news/');

async function getRecentNews() {
  const list = await fetch(new URL(`/api/data/ord-news`, apiUrl).toString());
  if (list.ok) {
    // TODO: type as KVNamespaceListResult<unknown>
    const infoData = await list.json();
    return infoData;
  }
  console.log(`getRecentNews: ${list.status}`);
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
        stat={number}
      />
      <StatsCard
        title="Author"
        stat={author ? author : 'not defined'}
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
          setNewsList(data.keys.map((key: any) => key.name));
        }
      })
      .catch(err => {
        console.log(`getRecentNews: ${err}`);
        setNewsList(undefined);
      });
  }, []);

  useEffect(() => {
    if (newsList && newsList.length > 0) {
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
