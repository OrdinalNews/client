import { useEffect, useState } from 'react';
import { Heading, Text } from '@chakra-ui/react';
import { InscriptionMeta, OrdinalNews } from '../../lib/api-types';

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
            console.log(`type: ${typeof data}`);
            console.log(`data: ${JSON.stringify(data)}`);
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
      <Text>Detected {newsList.length} news ordinals</Text>
      <Heading>List</Heading>
      <Text>{JSON.stringify(newsList)}</Text>
      <Heading>Data</Heading>
      <Text>{JSON.stringify(newsData)}</Text>
    </>
  );
}
