import { Modal, Form, InputNumber, Input, Button } from 'antd';
import { Plus, ArrowUp, Settings } from 'lucide-react';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { getMedicineUnitTranslate } from '../../Utils/Translate&FormatColor/MedicineUtil';
import { CreateStockHistoryActionAsync } from '../../Redux/ReducerAPI/MedicineStockHistoryReducer';

const { TextArea } = Input;

const StockHistoryModal = ({ open, onOpenChange, selectedMedicine, actionType, filter }) => {
    const { run } = useAsyncAction();
    const [form] = Form.useForm();

    const handleSubmit = values => {
        const history = {
            medicineId: selectedMedicine?.medicineId,
            quantity: values.quantity,
            note: values.note,
            type: actionType.type,
        };

        run(CreateStockHistoryActionAsync(history, filter), () => {
            onOpenChange(false);
            form.resetFields();
        });
    };

    const handleCancel = () => {
        onOpenChange(false);
        form.resetFields();
    };

    return (
        <Modal
            title="Tạo lịch sử kho"
            open={open}
            onCancel={handleCancel}
            width={600}
            footer={null}
            centered
        >
            <div className="mb-6">
                <p className="text-gray-600 mb-4">
                    {actionType?.label} cho thuốc {selectedMedicine?.name}
                </p>

                {selectedMedicine && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">Thông tin thuốc:</h4>
                            <div className="flex items-center">
                                {actionType.icon}
                                <span className="ml-1 font-medium text-emerald-600">
                                    {actionType.label}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Mã thuốc:</span>
                                <span className="ml-2 font-medium">
                                    {selectedMedicine.medicineCode}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Tên thuốc:</span>
                                <span className="ml-2 font-medium">{selectedMedicine.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Tồn kho hiện tại:</span>
                                <span className="ml-2 font-medium">
                                    {selectedMedicine.stockQuantity}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Đơn vị:</span>
                                <span className="ml-2 font-medium">
                                    {getMedicineUnitTranslate(selectedMedicine.unit)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
                {/* Số lượng */}
                <Form.Item
                    name="quantity"
                    label={
                        <span className="block text-sm font-medium text-gray-700">Số lượng</span>
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập số lượng',
                        },
                        {
                            type: 'number',
                            min: 1,
                            message: 'Số lượng phải lớn hơn 0',
                        },
                    ]}
                >
                    <InputNumber
                        placeholder="Nhập số lượng"
                        size="large"
                        style={{ width: '100%' }}
                        min={1}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>

                {/* Ghi chú */}
                <Form.Item
                    name="note"
                    label={<span className="block text-sm font-medium text-gray-700">Ghi chú</span>}
                    rules={[
                        {
                            max: 500,
                            message: 'Ghi chú không được vượt quá 500 ký tự',
                        },
                    ]}
                >
                    <TextArea
                        placeholder="Nhập ghi chú (tùy chọn)"
                        rows={4}
                        size="large"
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                {/* Footer buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t">
                    <Button size="large" onClick={handleCancel}>
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default StockHistoryModal;
