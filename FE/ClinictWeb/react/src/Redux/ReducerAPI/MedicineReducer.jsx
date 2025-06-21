import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    medicines: [],
    totalPagesCount: 0,
    totalItemsCount: 0,
};

const MedicineReducer = createSlice({
    name: 'MedicineReducer',
    initialState,
    reducers: {
        setMedicine: (state, action) => {
            state.medicines = action.payload.items;
            state.totalItemsCount = action.payload.totalItemsCount;
            state.totalPagesCount = action.payload.totalPagesCount;
        },
        setListMedicine: (state, action) => {
            state.medicines = action.payload;
        },
    },
});

export const { setMedicine, setListMedicine } = MedicineReducer.actions;

export default MedicineReducer.reducer;

export const GetMedicinesActionAsync = filter => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/medicine/filter`, {
                params: {
                    Search: filter.search,
                    PageIndex: filter.pageIndex,
                    PageSize: filter.pageSize,
                    MedicineTypeId: filter.medicineTypeId,
                    Status: filter.status,
                    SortBy: filter.sortBy,
                    SortField: filter.sortField,
                },
            });
            if (res.isSuccess && res.data) {
                dispatch(setMedicine(res.data));
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

export const GetAllMedicineActionAsync = () => {
    return async dispatch => {
        try {
            const res = await httpClient.get(`/api/v1/medicine`);
            if (res.isSuccess && res.data) {
                dispatch(setListMedicine(res.data));
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
