import { createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../Utils/Interceptor';

const initialState = {
    medicines: [
        {
            medicineId: 'b76b7c25-1a4a-49f5-be98-08dda1a52996',
            medicineCode: 'MED-97ECF7',
            name: 'Vitamin B1',
            medicineTypeId: 'e0474a37-89a5-4eec-fbc7-08dd9afc1426',
            medicineTypeName: 'Vitamin',
            unit: 'Box',
            price: 40000,
            stockQuantity: 50,
            minQuantity: 10,
            status: 'InStock',
        },
        {
            medicineId: 'cd9da946-0ae5-4cc7-5bd1-08dda129fe76',
            medicineCode: 'MED-EF8F66',
            name: 'Diazepam',
            medicineTypeId: '95f3b0f5-4838-47b4-1d26-08dda07d84b4',
            medicineTypeName: 'An thần',
            unit: 'Tablet',
            price: 98000,
            stockQuantity: 5,
            minQuantity: 10,
            status: 'LowStock',
        },
        {
            medicineId: '4a5f3a3c-5b20-4cd4-5bd0-08dda129fe76',
            medicineCode: 'MED-DC43B7',
            name: 'Pantoprazole',
            medicineTypeId: '91d17ef4-5e40-4e24-fbc6-08dd9afc1426',
            medicineTypeName: 'Dạ dày',
            unit: 'Tube',
            price: 112000,
            stockQuantity: 40,
            minQuantity: 25,
            status: 'InStock',
        },
        {
            medicineId: 'c468fbce-e3ab-4680-5bcf-08dda129fe76',
            medicineCode: 'MED-782C09',
            name: 'Magnesium B6',
            medicineTypeId: 'e0474a37-89a5-4eec-fbc7-08dd9afc1426',
            medicineTypeName: 'Vitamin',
            unit: 'Box',
            price: 175000,
            stockQuantity: 18,
            minQuantity: 20,
            status: 'LowStock',
        },
        {
            medicineId: 'b648ac91-fcd5-4b57-5bce-08dda129fe76',
            medicineCode: 'MED-9FC044',
            name: 'Loperamide',
            medicineTypeId: 'b3ac9945-d795-4d08-1d27-08dda07d84b4',
            medicineTypeName: 'Tiêu chày',
            unit: 'Strip',
            price: 65000,
            stockQuantity: 0,
            minQuantity: 10,
            status: 'OutOfStock',
        },
        {
            medicineId: '765bbf3e-2101-423c-5bcd-08dda129fe76',
            medicineCode: 'MED-19FFCB',
            name: 'Melatonin',
            medicineTypeId: '95f3b0f5-4838-47b4-1d26-08dda07d84b4',
            medicineTypeName: 'An thần',
            unit: 'Bottle',
            price: 145000,
            stockQuantity: 10,
            minQuantity: 15,
            status: 'LowStock',
        },
        {
            medicineId: '0ebfb72f-c94f-4340-5bcc-08dda129fe76',
            medicineCode: 'MED-4301F2',
            name: 'Paracetamol Extra',
            medicineTypeId: 'e0474a37-89a5-4eec-fbc7-08dd9afc1426',
            medicineTypeName: 'Vitamin',
            unit: 'Box',
            price: 190000,
            stockQuantity: 70,
            minQuantity: 20,
            status: 'InStock',
        },
        {
            medicineId: 'df4b37b0-effa-4c8a-5bcb-08dda129fe76',
            medicineCode: 'MED-8B0969',
            name: 'Omeprazole',
            medicineTypeId: '91d17ef4-5e40-4e24-fbc6-08dd9afc1426',
            medicineTypeName: 'Dạ dày',
            unit: 'Tablet',
            price: 85000,
            stockQuantity: 120,
            minQuantity: 30,
            status: 'InStock',
        },
        {
            medicineId: '00d7a552-796c-476a-5bca-08dda129fe76',
            medicineCode: 'MED-26311D',
            name: 'Amoxicillin ',
            medicineTypeId: 'e0474a37-89a5-4eec-fbc7-08dd9afc1426',
            medicineTypeName: 'Vitamin',
            unit: 'Box',
            price: 190000,
            stockQuantity: 70,
            minQuantity: 20,
            status: 'InStock',
        },
        {
            medicineId: '7c03d6f4-e29d-4b7d-2d80-08dd9afc46f8',
            medicineCode: 'MED0002',
            name: 'Thuốc Trĩ',
            medicineTypeId: 'e0474a37-89a5-4eec-fbc7-08dd9afc1426',
            medicineTypeName: 'Vitamin',
            unit: 'Box',
            price: 12000,
            stockQuantity: 0,
            minQuantity: 10,
            status: 'OutOfStock',
        },
    ],
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
    },
});

export const { setMedicine } = MedicineReducer.actions;

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
