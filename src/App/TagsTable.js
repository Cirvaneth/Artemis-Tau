import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  CircularProgress,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  TableSortLabel,
  Box
} from '@mui/material';

const getApiUrl = (page, pageSize, sortField, sortOrder) => {
  const baseApiUrl = `https://api.stackexchange.com/2.2/tags?site=stackoverflow`;
  return `${baseApiUrl}&page=${page + 1}&pagesize=${pageSize}&order=${sortOrder}&sort=${sortField}`;
};

const fetchTags = async (page, pageSize, sortField, sortOrder) => {
  try {
    const url = getApiUrl(page, pageSize, sortField, sortOrder);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return { items: [], has_more: false };
  }
};

function TagsTable() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('popular');
  const [sortOrder, setSortOrder] = useState('desc');

  const { data, isLoading, error } = useQuery({
    queryKey: ['tags', page, pageSize, sortField, sortOrder],
    queryFn: () => fetchTags(page, pageSize, sortField, sortOrder),
    keepPreviousData: true,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePageSize = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortChange = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Alert severity="error">An error has occurred: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' && sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSortChange('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'popular'}
                  direction={sortField === 'popular' && sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSortChange('popular')}
                >
                  Count
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.items.map((tag) => (
              <TableRow key={tag.name}>
                <TableCell>{tag.name}</TableCell>
                <TableCell align="right">{tag.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={-1}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangePageSize}
        labelDisplayedRows={({ from, to }) => `${from}-${to}`}
        nextIconButtonProps={{ disabled: !data?.has_more }}
      />
    </Paper>
  );
}

export default TagsTable;
