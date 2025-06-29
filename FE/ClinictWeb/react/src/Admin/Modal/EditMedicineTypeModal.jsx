import { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, Input } from 'antd';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { UpdateMedicineTypeActionAsync } from '../../Redux/ReducerAPI/MedicineTypeReducer';

const EditMedicineTypeModal = ({ open, onOpenChange, medicineType }) => {
    const { run } = useAsyncAction();
    const [form] = Form.useForm();

    useEffect(() => {
        if (medicineType && open) {
            form.setFieldsValue({
                name: medicineType.name,
            });
        }
    }, [medicineType, open, form]);

    const handleSubmit = async values => {
        run(UpdateMedicineTypeActionAsync(medicineType.medicineTypeId, values), () => {
            onOpenChange(false);
        });
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa loại thuốc</DialogTitle>
                    <DialogDescription>Cập nhật tên loại thuốc.</DialogDescription>
                </DialogHeader>

                <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
                    <Form.Item
                        name="name"
                        label={
                            <span className="block text-sm font-medium text-gray-700">
                                Tên loại thuốc
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Tên loại thuốc không được để trống',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên loại thuốc" className="w-full" />
                    </Form.Item>

                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="flex-1 bg-transparent"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Cập nhật loại thuốc
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditMedicineTypeModal;
