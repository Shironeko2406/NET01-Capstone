import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('success');

    const showMessage = (msg, type = 'success') => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    return (
        <MessageContext.Provider value={{ showMessage }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={severity}
                    variant="filled"
                    onClose={handleClose}
                >
                    {message}
                </Alert>
            </Snackbar>
        </MessageContext.Provider>
    );
};
