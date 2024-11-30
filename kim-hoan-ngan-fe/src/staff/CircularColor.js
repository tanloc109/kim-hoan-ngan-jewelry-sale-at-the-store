import React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function CircularColor() {
    return (
        <Stack sx={{ color: '#FFA500' }} spacing={2} direction="row">
            <CircularProgress sx={{ color: '#FFA500' }} />
        </Stack>
    );
}
