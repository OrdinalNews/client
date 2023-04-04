import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root404 from './routes/root-404';
import RootIndex from './routes/root-index';
import PostNews from './routes/post-news';
import ViewNews from './routes/view-news';
import theme from './style/theme';
import './style/app.css';
import RecentNews from './routes/recent-news';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootIndex />,
    errorElement: <Root404 />,
  },
  {
    path: '/post-news',
    element: <PostNews />,
  },
  {
    path: '/view-news',
    element: <ViewNews />,
  },
  {
    path: '/newest',
    element: <RecentNews />,
  },
]);

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}
