import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const BasicPagination = ({ count, page, onChange }) => {
  return (
    <Stack spacing={2}>
      <Pagination 
        count={count} 
        page={page} 
        onChange={(_, value) => onChange(value)} 
        color="primary" 
      />
    </Stack>
  );
};

export default BasicPagination;
