import { Stat, StatLabel, StatNumber } from '@chakra-ui/react';

interface StatsCardProps {
  title?: string;
  stat: string | number | JSX.Element;
  minH?: string;
}

export default function StatsCard(props: StatsCardProps) {
  const { title, stat, minH } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px'}
      borderColor={'gray.600'}
      rounded={'lg'}
      minH={minH}
    >
      {title && (
        <StatLabel
          fontWeight={'medium'}
          isTruncated
        >
          {title}
        </StatLabel>
      )}
      <StatNumber
        fontSize={'md'}
        fontWeight={'bold'}
      >
        {stat}
      </StatNumber>
    </Stat>
  );
}
