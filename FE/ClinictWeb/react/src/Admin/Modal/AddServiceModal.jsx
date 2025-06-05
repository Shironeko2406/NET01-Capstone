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
import { Textarea } from '@/components/ui/textarea';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { CreateServiceActionAsync } from '../../Redux/ReducerAPI/ServiceReducer';
import { Button } from '@/components/ui/button';

const AddServiceModal = ({ open, onOpenChange }) => {
    const { run } = useAsyncAction();
    const formik = useFormik({
        initialValues: {
            name: '',
            price: '',
            description: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Tên dịch vụ không được để trống'),
            price: Yup.number()
                .typeError('Giá phải là một số')
                .min(0, 'Giá phải lớn hơn hoặc bằng 0')
                .required('Giá không được để trống'),
            description: Yup.string(),
        }),
        onSubmit: (values, { resetForm }) => {
            run(CreateServiceActionAsync(values), () => {
                onOpenChange(false);
                resetForm();
            });
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thêm dịch vụ mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin chi tiết cho dịch vụ bạn muốn thêm.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên dịch vụ
                        </label>
                        <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Nhập tên dịch vụ"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                        <Input
                            name="price"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Nhập giá"
                        />
                        {formik.touched.price && formik.errors.price && (
                            <p className="text-sm text-red-500 mt-1">{formik.errors.price}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <Textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Nhập mô tả"
                            rows={4}
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="text-sm text-red-500 mt-1">{formik.errors.description}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Tạo dịch vụ
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddServiceModal;
