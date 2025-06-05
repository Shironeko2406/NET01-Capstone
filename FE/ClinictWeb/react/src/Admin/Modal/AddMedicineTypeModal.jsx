import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { CreateMedicineTypeActionAsync } from '../../Redux/ReducerAPI/MedicineTypeReducer'; // giả sử bạn tạo API tương tự

const AddMedicineTypeModal = ({ open, onOpenChange }) => {
    const { run } = useAsyncAction();

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Tên loại thuốc không được để trống'),
        }),
        onSubmit: (values, { resetForm }) => {
            run(CreateMedicineTypeActionAsync(values), () => {
                onOpenChange(false);
                resetForm();
            });
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thêm loại thuốc mới</DialogTitle>
                    <DialogDescription>Nhập tên loại thuốc bạn muốn thêm.</DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên loại thuốc
                        </label>
                        <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Nhập tên loại thuốc"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Tạo loại thuốc
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddMedicineTypeModal;
