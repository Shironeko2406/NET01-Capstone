import { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Card,
    Row,
    Col,
    Checkbox,
    Typography,
    Divider,
    Upload,
} from 'antd';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, UserCheck, Stethoscope, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { GetCityDataActionAsync } from '../../Redux/ReducerAPI/CityReducer';
import { GetSpecialtiesActionAsync } from '../../Redux/ReducerAPI/SpecialtyReducer';
import { genders, roles } from '../../Utils/Data/DataExport';
import { imageDB } from '../../FireBase/Config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { PlusOutlined } from '@ant-design/icons';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { CreateUsersInternalActionAsync } from '../../Redux/ReducerAPI/UsersReducer';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateUser = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { cityData } = useSelector(state => state.CityReducer);
    const { specialties } = useSelector(state => state.SpecialtyReducer);
    const [addressData, setAddressData] = useState({
        street: '',
        ward: '',
        district: '',
        province: '',
    });
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const { run } = useAsyncAction();

    useEffect(() => {
        dispatch(GetCityDataActionAsync());
        dispatch(GetSpecialtiesActionAsync());
    }, [dispatch]);

    useEffect(() => {
        if (addressData.province) {
            const selectedProvince = cityData.find(p => p.Name === addressData.province);
            setDistricts(selectedProvince?.Districts || []);
            setWards([]);

            setAddressData(prev => ({
                ...prev,
                district: '',
                ward: '',
            }));

            form.setFieldsValue({ district: undefined, ward: undefined });
        }
    }, [addressData.province, cityData, form]);

    useEffect(() => {
        if (addressData.district) {
            const selectedDistrict = districts.find(d => d.Name === addressData.district);
            setWards(selectedDistrict?.Wards || []);

            setAddressData(prev => ({
                ...prev,
                ward: '',
            }));

            form.setFieldsValue({ ward: undefined });
        }
    }, [addressData.district, districts, form]);

    const handleProvinceChange = value => {
        const selected = cityData.find(p => p.Id === value);
        if (selected) {
            setAddressData(prev => ({ ...prev, province: selected.Name }));
        }
    };

    const handleDistrictChange = value => {
        const selected = districts.find(d => d.Id === value);
        if (selected) {
            setAddressData(prev => ({ ...prev, district: selected.Name }));
        }
    };

    const handleWardChange = value => {
        const selected = wards.find(w => w.Id === value);
        if (selected) {
            setAddressData(prev => ({ ...prev, ward: selected.Name }));
        }
    };

    const handleSpecialtyChange = checkedValues => {
        setSelectedSpecialties(checkedValues);
    };

    const removeSpecialty = specialtyId => {
        const newSpecialties = selectedSpecialties.filter(id => id !== specialtyId);
        setSelectedSpecialties(newSpecialties);
        form.setFieldsValue({ specialtyIds: newSpecialties });
    };

    const handleUpload = ({ file, onSuccess, onError }) => {
        const storageRef = ref(imageDB, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            snapshot => {},
            error => {
                console.error(error);
                onError(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setImageUrl(downloadURL);
                    form.setFieldsValue({ avatar: downloadURL });
                    onSuccess(null, file);
                } catch (err) {
                    console.error(err);
                    onError(err);
                }
            }
        );
    };

    const onFinish = values => {
        const fullAddress = `${addressData.street}, ${addressData.ward}, ${addressData.district}, ${addressData.province}`;

        const submitData = {
            ...values,
            address: fullAddress,
            dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
            specialtyIds: selectedRole === 'Doctor' ? selectedSpecialties : [],
            avatar: imageUrl,
        };
        run(CreateUsersInternalActionAsync(submitData), () => {
            onReset();
        });
    };

    const onReset = () => {
        form.resetFields();
        setAddressData({
            street: '',
            ward: '',
            district: '',
            province: '',
        });
        setSelectedRole('');
        setSelectedSpecialties([]);
        setDistricts([]);
        setWards([]);
    };

    return (
        <>
            <div className="mb-3">
                <Title level={3} className="!text-gray-900 !mb-2 flex items-center gap-1">
                    <User className="w-8 h-8 text-blue-600" />
                    Tạo người dùng mới
                </Title>
                <Text className="text-gray-600 text-lg">
                    Điền thông tin để tạo tài khoản người dùng mới trong hệ thống
                </Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6"
                size="large"
                scrollToFirstError
            >
                {/* Personal Information */}
                <Card
                    className="shadow-lg !mb-3"
                    title={
                        <div className="flex items-center gap-1 text-lg font-semibold text-gray-800">
                            <User className="w-6 h-6 text-blue-600" />
                            Thông tin cá nhân
                        </div>
                    }
                >
                    <Row gutter={[16, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="fullName"
                                label={<span className="font-medium text-gray-700">Họ và tên</span>}
                                rules={[
                                    { required: true, message: 'Họ tên không được để trống' },
                                    { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' },
                                ]}
                            >
                                <Input placeholder="Nhập họ và tên" className="rounded-lg" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="email"
                                label={<span className="font-medium text-gray-700">Email</span>}
                                rules={[
                                    { required: true, message: 'Email không được để trống' },
                                    { type: 'email', message: 'Email không hợp lệ' },
                                ]}
                            >
                                <Input placeholder="Nhập địa chỉ email" className="rounded-lg" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="dateOfBirth"
                                label={<span className="font-medium text-gray-700">Ngày sinh</span>}
                                rules={[
                                    { required: true, message: 'Ngày sinh không được để trống' },
                                ]}
                            >
                                <DatePicker
                                    placeholder="Chọn ngày sinh"
                                    className="w-full rounded-lg"
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="gender"
                                label={<span className="font-medium text-gray-700">Giới tính</span>}
                                rules={[
                                    { required: true, message: 'Giới tính không được để trống' },
                                ]}
                            >
                                <Select placeholder="Chọn giới tính" className="rounded-lg">
                                    {genders.map(gender => (
                                        <Option key={gender.value} value={gender.value}>
                                            {gender.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="phoneNumber"
                                label={
                                    <span className="font-medium text-gray-700">Số điện thoại</span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Số điện thoại không được để trống',
                                    },
                                    {
                                        pattern: /^[0-9]{10,11}$/,
                                        message: 'Số điện thoại phải có 10-11 chữ số',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" className="rounded-lg" />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                name="avatar"
                                label={
                                    <span className="font-medium text-gray-700">Ảnh đại diện</span>
                                }
                                valuePropName="file"
                                getValueFromEvent={e => e && e.file.originFileObj}
                            >
                                <Upload
                                    customRequest={handleUpload}
                                    listType="picture-card"
                                    maxCount={1}
                                    onRemove={() => {
                                        setImageUrl('');
                                        form.setFieldsValue({ avatar: '' });
                                    }}
                                >
                                    {!imageUrl && (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Address Information */}
                <Card
                    className="shadow-lg !mb-3"
                    title={
                        <div className="flex items-center gap-1 text-lg font-semibold text-gray-800">
                            <MapPin className="w-6 h-6 text-green-600" />
                            Thông tin địa chỉ
                        </div>
                    }
                >
                    <Row gutter={[16, 0]}>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span className="font-medium text-gray-700">
                                        Địa chỉ cụ thể
                                    </span>
                                }
                                name="street"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập địa chỉ cụ thể' },
                                    { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự' },
                                ]}
                            >
                                <Input
                                    value={addressData.street}
                                    onChange={e =>
                                        setAddressData(prev => ({
                                            ...prev,
                                            street: e.target.value,
                                        }))
                                    }
                                    placeholder="Số nhà, tên đường..."
                                    className="rounded-lg"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="province"
                                label={
                                    <span className="font-medium text-gray-700">
                                        Tỉnh/Thành phố
                                    </span>
                                }
                                rules={[
                                    { required: true, message: 'Vui lòng chọn tỉnh/thành phố' },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn tỉnh/thành phố"
                                    onChange={handleProvinceChange}
                                    className="rounded-lg"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option?.children
                                            ?.toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {cityData.map(province => (
                                        <Select.Option key={province.Id} value={province.Id}>
                                            {province.Name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="district"
                                label={
                                    <span className="font-medium text-gray-700">Quận/Huyện</span>
                                }
                                rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                            >
                                <Select
                                    placeholder="Chọn quận/huyện"
                                    onChange={handleDistrictChange}
                                    disabled={!districts.length}
                                    className="rounded-lg"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option?.children
                                            ?.toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {districts.map(district => (
                                        <Select.Option key={district.Id} value={district.Id}>
                                            {district.Name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                name="ward"
                                label={<span className="font-medium text-gray-700">Phường/Xã</span>}
                                rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                            >
                                <Select
                                    placeholder="Chọn phường/xã"
                                    onChange={handleWardChange}
                                    disabled={!wards.length}
                                    className="rounded-lg"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option?.children
                                            ?.toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {wards.map(ward => (
                                        <Select.Option key={ward.Id} value={ward.Id}>
                                            {ward.Name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Role and Specialty Information */}
                <Card
                    className="shadow-lg !mb-3"
                    title={
                        <div className="flex items-center gap-1 text-lg font-semibold text-gray-800">
                            <UserCheck className="w-6 h-6 text-purple-600" />
                            Thông tin vai trò
                        </div>
                    }
                >
                    <Row gutter={[16, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="roleName"
                                label={<span className="font-medium text-gray-700">Vai trò</span>}
                                rules={[{ required: true, message: 'Vai trò không được để trống' }]}
                            >
                                <Select placeholder="Chọn vai trò" onChange={setSelectedRole}>
                                    {roles.map(role => (
                                        <Option key={role.value} value={role.value}>
                                            {role.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        {selectedRole === 'Doctor' && (
                            <Col xs={24}>
                                <Divider className="!my-1" />
                                <div className="space-y-4">
                                    <div className="flex items-center gap-1 mb-4">
                                        <Stethoscope className="w-5 h-5 text-blue-600" />
                                        <span className="font-medium text-gray-700 text-lg">
                                            Chuyên khoa
                                        </span>
                                        <span className="text-red-500">*</span>
                                    </div>

                                    <Form.Item
                                        name="specialtyIds"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Bác sĩ phải chọn ít nhất một chuyên khoa',
                                            },
                                        ]}
                                    >
                                        <Checkbox.Group
                                            onChange={handleSpecialtyChange}
                                            value={selectedSpecialties}
                                            className="w-full"
                                        >
                                            <Row gutter={[16, 16]}>
                                                {specialties.map(specialty => (
                                                    <Col
                                                        xs={24}
                                                        sm={8}
                                                        md={6}
                                                        key={specialty.specialtyId}
                                                    >
                                                        <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                                                            <Checkbox value={specialty.specialtyId}>
                                                                <div className="ml-2">
                                                                    <div className="font-medium text-gray-800">
                                                                        {specialty.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        {specialty.description}
                                                                    </div>
                                                                </div>
                                                            </Checkbox>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>

                                    {selectedSpecialties.length > 0 && (
                                        <div className="mt-4">
                                            <Text className="font-medium block mb-2">
                                                Chuyên khoa đã chọn:
                                            </Text>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSpecialties.map(specialtyId => {
                                                    const specialty = specialties.find(
                                                        s => s.specialtyId === specialtyId
                                                    );
                                                    return (
                                                        <Badge
                                                            key={specialtyId}
                                                            variant="outline"
                                                            className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium"
                                                        >
                                                            <span>{specialty?.name}</span>
                                                            <button
                                                                onClick={() =>
                                                                    removeSpecialty(specialtyId)
                                                                }
                                                                className="hover:text-red-500 transition-colors duration-200"
                                                                type="button"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        )}
                    </Row>
                </Card>

                {/* Submit Buttons */}
                <Card className="shadow-lg border-0 rounded-xl">
                    <div className="flex justify-end space-x-4">
                        <Button size="default" onClick={onReset}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="default"
                            className=" !bg-emerald-600"
                        >
                            Tạo người dùng
                        </Button>
                    </div>
                </Card>
            </Form>
        </>
    );
};

export default CreateUser;
