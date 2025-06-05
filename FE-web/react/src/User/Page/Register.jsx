import { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Radio, Upload, Button, Card, Row, Col } from 'antd';
import { BadgeInfo, Eye, EyeOff, MapPin, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { imageDB } from '../../FireBase/Config';
import { GetCityDataActionAsync } from '../../Redux/ReducerAPI/CityReducer';
import { useAsyncAction } from '../../Hooks/UseAsyncAction';
import { RegisterUserActionAsync } from '../../Redux/ReducerAPI/UsersReducer';

const { Option } = Select;

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cityData } = useSelector(state => state.CityReducer);
    const [showPassword, setShowPassword] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [form] = Form.useForm();
    const { run } = useAsyncAction();

    useEffect(() => {
        dispatch(GetCityDataActionAsync());
    }, [dispatch]);

    const handleCityChange = value => {
        const selectedCity = cityData.find(city => city.Name === value);
        setDistricts(selectedCity ? selectedCity.Districts : []);
        setWards([]);
        form.setFieldsValue({ district: undefined, ward: undefined });
    };

    const handleDistrictChange = value => {
        const selectedDistrict = districts.find(district => district.Name === value);
        setWards(selectedDistrict ? selectedDistrict.Wards : []);
        form.setFieldsValue({ ward: undefined });
    };

    const handleWardChange = value => {
        form.setFieldsValue({ ward: value });
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        try {
            const storageRef = ref(imageDB, `avatars/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setFileList([
                {
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url: downloadURL,
                    thumbUrl: downloadURL,
                },
            ]);
            form.setFieldsValue({ avatar: downloadURL });
            setAvatarUrl(downloadURL);
            onSuccess('Ok');
        } catch (error) {
            onError(error);
        }
    };

    // Handle form submission
    const onFinish = values => {
        const address = `${values.street}, ${values.ward}, ${values.district}, ${values.city}`;
        const finalValues = {
            ...values,
            address,
            dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
            avatar: avatarUrl,
        };
        run(RegisterUserActionAsync(finalValues), () => {
            navigate('/login');
        });
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-6xl bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl border border-sky-100 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Đăng ký tài khoản
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Đã có tài khoản?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-sky-600 hover:text-sky-700 transition-colors duration-200"
                        >
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    {/* Thông tin cá nhân */}
                    <Card
                        className="shadow-lg !mb-3"
                        title={
                            <div className="flex items-center gap-1 text-base font-semibold text-gray-800">
                                <User className="w-6 h-6 text-blue-600" />
                                Thông tin cá nhân
                            </div>
                        }
                    >
                        <Row gutter={[24, 16]}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700">Họ và tên</span>
                                    }
                                    name="fullName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Họ và tên không được để trống',
                                        },
                                    ]}
                                >
                                    <Input
                                        className="rounded-lg border border-sky-200 px-4 py-3"
                                        placeholder="Nhập họ và tên"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700">
                                            Số điện thoại
                                        </span>
                                    }
                                    name="phoneNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Số điện thoại không được để trống',
                                        },
                                        {
                                            pattern: /^[0-9]{10,11}$/,
                                            message: 'Số điện thoại không hợp lệ',
                                        },
                                    ]}
                                >
                                    <Input
                                        className="rounded-lg border border-sky-200 px-4 py-3"
                                        placeholder="Nhập số điện thoại"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700">Ngày sinh</span>
                                    }
                                    name="dateOfBirth"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Ngày sinh không được để trống',
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        className="w-full rounded-lg border border-sky-200 px-4 py-3"
                                        format="DD/MM/YYYY"
                                        placeholder="Chọn ngày sinh"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[24, 16]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700">Giới tính</span>
                                    }
                                    name="gender"
                                    rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                                >
                                    <Radio.Group size="large">
                                        <Radio value="Male">Nam</Radio>
                                        <Radio value="Female">Nữ</Radio>
                                        <Radio value="Other">Khác</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700">
                                            Ảnh đại diện
                                        </span>
                                    }
                                    name="avatar"
                                >
                                    <Upload
                                        customRequest={handleUpload}
                                        fileList={fileList}
                                        onChange={({ fileList }) => setFileList(fileList)}
                                        onRemove={() => {
                                            setAvatarUrl('');
                                            setFileList([]);
                                            form.setFieldsValue({ avatar: '' });
                                        }}
                                        maxCount={1}
                                        accept="image/*"
                                        listType="picture-card"
                                    >
                                        {fileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* Thông tin tài khoản */}
                    <Card
                        className="shadow-lg !mb-3"
                        title={
                            <div className="flex items-center gap-1 text-base font-semibold text-gray-800">
                                <BadgeInfo className="w-6 h-6 text-blue-600" />
                                Thông tin tài khoản
                            </div>
                        }
                    >
                        <Row gutter={[24, 16]}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label={<span className="font-medium text-gray-700">Email</span>}
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Email không được để trống' },
                                        { type: 'email', message: 'Email không hợp lệ' },
                                    ]}
                                >
                                    <Input
                                        className="rounded-lg border border-sky-200 px-4 py-3"
                                        placeholder="you@example.com"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700">
                                            Tên đăng nhập
                                        </span>
                                    }
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên đăng nhập không được để trống',
                                        },
                                    ]}
                                >
                                    <Input
                                        className="rounded-lg border border-sky-200 px-4 py-3"
                                        placeholder="Nhập tên đăng nhập"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700">Mật khẩu</span>
                                    }
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Mật khẩu không được để trống' },
                                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                                    ]}
                                >
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            className="rounded-lg border border-sky-200 px-4 py-3"
                                            placeholder="••••••••"
                                            size="large"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* Thông tin địa chỉ */}
                    <Card
                        className="shadow-lg !mb-3"
                        title={
                            <div className="flex items-center gap-1 text-base font-semibold text-gray-800">
                                <MapPin className="w-6 h-6 text-green-600" />
                                Thông tin địa chỉ
                            </div>
                        }
                    >
                        <Row gutter={[24, 16]}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700">
                                            Tỉnh/Thành phố
                                        </span>
                                    }
                                    name="city"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn tỉnh/thành phố' },
                                    ]}
                                >
                                    <Select
                                        className="w-full"
                                        placeholder="Chọn tỉnh/thành phố"
                                        onChange={handleCityChange}
                                        showSearch
                                        size="large"
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                    >
                                        {cityData.map(city => (
                                            <Option key={city.Id} value={city.Name}>
                                                {city.Name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700">
                                            Quận/Huyện
                                        </span>
                                    }
                                    name="district"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn quận/huyện' },
                                    ]}
                                >
                                    <Select
                                        className="w-full"
                                        placeholder="Chọn quận/huyện"
                                        onChange={handleDistrictChange}
                                        disabled={!districts.length}
                                        showSearch
                                        size="large"
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                    >
                                        {districts.map(district => (
                                            <Option key={district.Id} value={district.Name}>
                                                {district.Name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label={
                                        <span className="font-medium text-gray-700">Phường/Xã</span>
                                    }
                                    name="ward"
                                    rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                                >
                                    <Select
                                        className="w-full"
                                        placeholder="Chọn phường/xã"
                                        onChange={handleWardChange}
                                        disabled={!wards.length}
                                        showSearch
                                        size="large"
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                    >
                                        {wards.map(ward => (
                                            <Option key={ward.Id} value={ward.Name}>
                                                {ward.Name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[24, 16]}>
                            <Col xs={24}>
                                <Form.Item
                                    name="street"
                                    label={
                                        <span className="font-medium text-gray-700">
                                            Địa chỉ chi tiết
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Địa chỉ chi tiết không được để trống',
                                        },
                                    ]}
                                >
                                    <Input
                                        className="rounded-lg border border-sky-200 px-4 py-3"
                                        placeholder="Nhập số nhà, tên đường..."
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* Submit Button */}
                    <div className="text-center">
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                className="px-12 py-3 rounded-lg text-base font-medium !bg-gradient-to-r !from-sky-500 !to-blue-600 hover:from-sky-600 hover:to-blue-700 border-none h-auto"
                            >
                                Đăng ký tài khoản
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;
