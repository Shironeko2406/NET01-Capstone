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
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { CreateSpecialtyActionAsync } from '../../Redux/ReducerAPI/SpecialtyReducer';

const AddSpecialtyModal = ({ open, onOpenChange }) => {
    const { run } = useAsyncAction();

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Tên chuyên khoa không được để trống'),
            description: Yup.string(),
        }),
        onSubmit: (values, { resetForm }) => {
            run(CreateSpecialtyActionAsync(values), () => {
                onOpenChange(false);
                resetForm();
            });
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thêm chuyên khoa mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin chi tiết cho chuyên khoa bạn muốn thêm.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên chuyên khoa
                        </label>
                        <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Nhập tên chuyên khoa"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
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
                            Tạo chuyên khoa
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddSpecialtyModal;
