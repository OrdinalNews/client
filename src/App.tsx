import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import './index.css';
import Root404 from './routes/root-404';
import RootIndex from './routes/root-index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootIndex />,
    errorElement: <Root404 />,
  },
]);

export default function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}
