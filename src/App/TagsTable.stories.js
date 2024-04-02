
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TagsTable from './TagsTable';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { handlers } from './mocks/handlers'; 


export default {
  title: 'Components/TagsTable',
  component: TagsTable,
  decorators: [
    (Story) => (
      <QueryClientProvider client={new QueryClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
};

export const Default = () => <TagsTable />;

export const Loading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
    <CircularProgress />
  </Box>
);

export const WithData = () => <TagsTable />;
export const Empty = () => <TagsTable />;
