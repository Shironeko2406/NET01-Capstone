import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';
import { GetMedicinesActionAsync } from './MedicineReducer';

const initialState = {
    listStockHistory: [],
    totalPagesCount: 0,
    totalItemsCount: 0,
};

const MedicineStockHistoryReducer = createSlice({
    name: 'MedicineStockHistoryReducer',
    initialState,
    reducers: {
        setListStockHistory: (state, action) => {
            state.listStockHistory = action.payload.items;
            state.totalItemsCount = action.payload.totalItemsCount;
            state.totalPagesCount = action.payload.totalPagesCount;
        },
    },
});

export const { setListStockHistory } = MedicineStockHistoryReducer.actions;

export default MedicineStockHistoryReducer.reducer;

export const GetMedicineStockHistoryActionAsync = filter => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/medicineStockHistory`, {
                params: {
                    Search: filter.search,
                    PageIndex: filter.pageIndex,
                    PageSize: filter.pageSize,
                    Type: filter.type,
                    SortBy: filter.sortBy,
                    FromDate: filter.fromDate,
                    ToDate: filter.toDate,
                },
            });
            if (res.isSuccess && res.data) {
                dispatch(setListStockHistory(res.data));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };
};

export const CreateStockHistoryActionAsync = (data, filter) => {
    return async dispatch => {
        try {
            const res = await httpClient.post(`/api/v1/medicineStockHistory`, data);
            if (res.isSuccess && res.data) {
                await dispatch(GetMedicinesActionAsync(filter));
                return { success: true, data: null, message: res.message };
            } else if (res.isSuccess && !res.data) {
                return { success: false, data: null, message: res.message };
            } else {
                return { success: false, message: res.message };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'System error' };
        }
    };
};
