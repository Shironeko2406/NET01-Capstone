import React, { useCallback, useState } from 'react';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker, Select } from 'antd'; // Import Ant Design Select
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import dayjs from 'dayjs';
import _ from 'lodash';
import { genders } from '../../Utils/Data/DataExport';
import { formatDate } from '../../Utils/Format/FormatDate';

const { Option } = Select; // Destructure Option from Ant Design Select

const PatientInfoStep = ({
    patientInfo,
    setPatientInfo,
    cityData,
    selectedCity,
    setSelectedCity,
    selectedDistrict,
    setSelectedDistrict,
    selectedWard,
    setSelectedWard,
    streetAddress,
    setStreetAddress,
}) => {
    const [localStreetAddress, setLocalStreetAddress] = useState(streetAddress);

    const debouncedSetPatientInfo = useCallback(
        _.debounce(updatedInfo => {
            setPatientInfo(prev => ({ ...prev, ...updatedInfo }));
        }, 500),
        [setPatientInfo]
    );

    const debouncedSetStreetAddress = useCallback(
        _.debounce(value => {
            setStreetAddress(value);
        }, 300),
        [setStreetAddress]
    );

    const handleStreetAddressChange = e => {
        const value = e.target.value;
        setLocalStreetAddress(value);
        debouncedSetStreetAddress(value);
    };

    const getDistricts = () => {
        if (!selectedCity) return [];
        const city = cityData.find(c => c.Name === selectedCity);
        return city ? city.Districts : [];
    };

    const getWards = () => {
        if (!selectedDistrict) return [];
        const district = getDistricts().find(d => d.Name === selectedDistrict);
        return district ? district.Wards : [];
    };

    // Handlers with debounce
    const handleInputChange = e => {
        const { name, value } = e.target;
        debouncedSetPatientInfo({ [name]: value });
    };

    const handleDateChange = date => {
        setPatientInfo(prev => ({ ...prev, dateOfBirth: date.format('YYYY-MM-DD') }));
    };

    const handleGenderChange = value => {
        setPatientInfo(prev => ({ ...prev, gender: value }));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
            <div className="border-b border-gray-200 px-1 py-4 mb-6 flex justify-between items-center">
                <CardTitle className="text-base">Thông tin bệnh nhân</CardTitle>
                <Badge variant="secondary" className="text-xs">
                    Bước 1/6
                </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                        Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        name="fullName"
                        placeholder="Nhập họ và tên"
                        defaultValue={patientInfo.fullName}
                        onChange={handleInputChange}
                        className="h-10 border-gray-300 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium">
                        Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        name="phoneNumber"
                        type="number"
                        placeholder="Nhập số điện thoại"
                        defaultValue={patientInfo.phoneNumber}
                        onChange={handleInputChange}
                        className="h-10 border-gray-300 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Nhập email"
                        defaultValue={patientInfo.email}
                        onChange={handleInputChange}
                        className="h-10 border-gray-300 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                        Ngày sinh <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                        value={patientInfo.dateOfBirth ? dayjs(patientInfo.dateOfBirth) : null}
                        onChange={handleDateChange}
                        placeholder="Chọn ngày sinh"
                        className="w-full h-10 border-gray-300"
                        format="DD/MM/YYYY"
                    />
                </div>

                <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-medium">
                        Giới tính <span className="text-red-500">*</span>
                    </Label>

                    <RadioGroup
                        className="flex gap-6 mt-2"
                        value={patientInfo.gender}
                        onValueChange={handleGenderChange}
                    >
                        {genders.map(gender => (
                            <div className="flex items-center space-x-2" key={gender.value}>
                                <RadioGroupItem value={gender.value} />
                                <Label
                                    htmlFor={gender.value}
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    {gender.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Address */}
                <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-medium">Địa chỉ</Label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-xs font-medium text-gray-600">
                                Tỉnh/Thành phố
                            </Label>
                            <Select
                                value={selectedCity || undefined}
                                onChange={value => {
                                    setSelectedCity(value || null);
                                    setSelectedDistrict(null);
                                    setSelectedWard(null);
                                }}
                                showSearch
                                filterOption={(input, option) =>
                                    option?.children.toLowerCase().includes(input.toLowerCase())
                                }
                                placeholder="Chọn tỉnh/thành"
                                allowClear
                                className="w-full"
                                style={{ height: '40px' }} // Match input height
                            >
                                {cityData &&
                                    cityData.map(city => (
                                        <Option key={city.Id} value={city.Name}>
                                            {city.Name}
                                        </Option>
                                    ))}
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="district" className="text-xs font-medium text-gray-600">
                                Quận/Huyện
                            </Label>
                            <Select
                                showSearch
                                filterOption={(input, option) =>
                                    option?.children.toLowerCase().includes(input.toLowerCase())
                                }
                                value={selectedDistrict || undefined}
                                onChange={value => {
                                    setSelectedDistrict(value || null);
                                    setSelectedWard(null);
                                }}
                                placeholder="Chọn quận/huyện"
                                allowClear
                                disabled={!selectedCity}
                                className="w-full"
                                style={{ height: '40px' }}
                            >
                                {getDistricts().map(district => (
                                    <Option key={district.Id} value={district.Name}>
                                        {district.Name}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ward" className="text-xs font-medium text-gray-600">
                                Phường/Xã
                            </Label>
                            <Select
                                showSearch
                                filterOption={(input, option) =>
                                    option?.children.toLowerCase().includes(input.toLowerCase())
                                }
                                value={selectedWard || undefined}
                                onChange={value => setSelectedWard(value || null)}
                                placeholder="Chọn phường/xã"
                                allowClear
                                disabled={!selectedDistrict}
                                className="w-full"
                                style={{ height: '40px' }}
                            >
                                {getWards().map(ward => (
                                    <Option key={ward.Id} value={ward.Name}>
                                        {ward.Name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2 mt-2">
                        <Label
                            htmlFor="streetAddress"
                            className="text-xs font-medium text-gray-600"
                        >
                            Số nhà, tên đường
                        </Label>
                        <Input
                            placeholder="Ví dụ: 123 Tân Hòa"
                            value={localStreetAddress}
                            onChange={handleStreetAddressChange}
                            className="h-10 border-gray-300 text-sm"
                        />
                    </div>

                    {patientInfo.address && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-md border">
                            <Label className="text-xs font-medium text-gray-600">
                                Địa chỉ đầy đủ:
                            </Label>
                            <p className="text-sm text-gray-800 mt-1">{patientInfo.address}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientInfoStep;
