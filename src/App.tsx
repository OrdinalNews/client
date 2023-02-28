import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './style/App.css';
import './style/index.css';
import PostNews from './routes/post-news';
import Root404 from './routes/root-404';
import RootIndex from './routes/root-index';
import theme from './style/theme';

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
]);

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}
