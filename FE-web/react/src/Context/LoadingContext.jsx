import React, { createContext, useContext, useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const LoadingContext = createContext();

export const useGlobalLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [open, setOpen] = useState(false);

    const showLoading = () => setOpen(true);
    const hideLoading = () => setOpen(false);

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}
            <Backdrop open={open} sx={{ color: '#fff', zIndex: 9999 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </LoadingContext.Provider>
    );
};
