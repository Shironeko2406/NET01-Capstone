import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { HOST_DOMAIN, httpClient } from '../../Utils/Interceptor';
import { message } from 'antd';

const initialState = {};

const InvoiceReducer = createSlice({
    name: 'InvoiceReducer',
    initialState,
    reducers: {},
});

export const {} = InvoiceReducer.actions;

export default InvoiceReducer.reducer;

export const GetPaymentUrlInvoiceActionAsync = invoiceId => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/invoice/${invoiceId}/payment-url`);
            if (res) {
                window.open(res.paymentUrl, '_blank');
                return true;
            } else {
                message.error('Không lấy được Url thanh toán');
                return false;
            }
        } catch (error) {
            message.error('Lỗi hệ thống');
            return false;
        }
    };
};
