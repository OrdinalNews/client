import { useEffect, useState } from 'react';
import { Text } from '@chakra-ui/react';
import { InscriptionMeta, OrdinalNews } from '../../lib/api-types';
import { KVNamespaceListResult } from '@cloudflare/workers-types';

async function getRecentNews() {
  const url = new URL('https://inscribe.news/');
  const info = await fetch(new URL(`/api/data/ord-news`, url).toString());
  if (info.ok) {
    // TODO: type as KVNamespaceListResult<unknown>
    const infoData = await info.json();
    return infoData;
  }
  console.log(`getRecentNews err: ${info.status}`);
  return undefined;
}

export default function RecentNews() {
  const [loading, setLoading] = useState(true);
  const [newsList, setNewsList] = useState<InscriptionMeta[]>([]);

  useEffect(() => {
    getRecentNews().then(data => {
      if (data) {
        const limit = 24;
        let counter = 0;
        const newsObj: InscriptionMeta[] = [];
        for (const key in data.keys) {
          newsObj.push(data.keys[key].metadata);
          counter++;
          if (counter >= limit) {
            break;
          }
        }
        setNewsList(newsObj);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!newsList) {
    return <Text>Failed to load news.</Text>;
  }

  return (
    <>
      <Text>Detected {newsList.length} news ordinals</Text>
      <Text>{JSON.stringify(newsList)}</Text>
    </>
  );
}
