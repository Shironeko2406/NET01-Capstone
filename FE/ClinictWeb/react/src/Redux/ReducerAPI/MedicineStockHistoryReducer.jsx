import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

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
