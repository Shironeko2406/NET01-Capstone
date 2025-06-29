import { Modal, Form, Input, InputNumber, Select, Button } from 'antd';
import { useSelector } from 'react-redux';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { CreateMedicineActionAsync } from '../../Redux/ReducerAPI/MedicineReducer';
import { medicineUnits } from '../../Utils/Data/DataExport';

const { TextArea } = Input;
const { Option } = Select;

const AddMedicineModal = ({ filter, open, onOpenChange }) => {
    const { medicineTypes } = useSelector(state => state.MedicineTypeReducer);
    const { run } = useAsyncAction();
    const [form] = Form.useForm();

    const handleSubmit = async values => {
        run(CreateMedicineActionAsync(values, filter), () => {
            onOpenChange(false);
            form.resetFields();
        });
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Modal
            title="Thêm thuốc mới"
            open={open}
            onCancel={handleCancel}
            width={1000}
            footer={null}
            centered
        >
            <div className="mb-4">
                <p className="text-gray-600">Nhập thông tin chi tiết cho thuốc bạn muốn thêm.</p>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                        name="name"
                        label={
                            <span className="block text-sm font-medium text-gray-700">
                                Tên thuốc
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Tên thuốc không được để trống',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên thuốc" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="medicineTypeId"
                        label={
                            <span className="block text-sm font-medium text-gray-700">
                                Loại thuốc
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Loại thuốc không được để trống',
                            },
                        ]}
                    >
                        <Select placeholder="Chọn loại thuốc" size="large">
                            {medicineTypes.map(type => (
                                <Option key={type.medicineTypeId} value={type.medicineTypeId}>
                                    {type.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="unit"
                        label={
                            <span className="block text-sm font-medium text-gray-700">Đơn vị</span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Đơn vị không được để trống',
                            },
                        ]}
                    >
                        <Select placeholder="Chọn đơn vị" size="large">
                            {medicineUnits.map(unit => (
                                <Option key={unit.value} value={unit.value}>
                                    {unit.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                        name="price"
                        label={<span className="block text-sm font-medium text-gray-700">Giá</span>}
                        rules={[
                            {
                                required: true,
                                message: 'Giá không được để trống',
                            },
                            {
                                type: 'number',
                                min: 0,
                                message: 'Giá phải lớn hơn hoặc bằng 0',
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập giá"
                            size="large"
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            addonAfter="VNĐ"
                        />
                    </Form.Item>

                    <Form.Item
                        name="stockQuantity"
                        label={
                            <span className="block text-sm font-medium text-gray-700">
                                Số lượng tồn kho
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Số lượng tồn kho không được để trống',
                            },
                            {
                                type: 'number',
                                min: 0,
                                message: 'Số lượng tồn kho phải lớn hơn hoặc bằng 0',
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập số lượng tồn kho"
                            size="large"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="minQuantity"
                        label={
                            <span className="block text-sm font-medium text-gray-700">
                                Số lượng tối thiểu
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Số lượng tối thiểu không được để trống',
                            },
                            {
                                type: 'number',
                                min: 0,
                                message: 'Số lượng tối thiểu phải lớn hơn hoặc bằng 0',
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập số lượng tối thiểu"
                            size="large"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="description"
                    label={<span className="block text-sm font-medium text-gray-700">Mô tả</span>}
                >
                    <TextArea placeholder="Nhập mô tả" rows={4} size="large" />
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
                        className="!bg-emerald-600"
                    >
                        Tạo thuốc
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddMedicineModal;
