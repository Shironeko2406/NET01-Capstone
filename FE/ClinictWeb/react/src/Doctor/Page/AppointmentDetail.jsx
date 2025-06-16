// 'use client';
// import { useState } from 'react';
// import { Form, Input, Button as AntButton, Select, message } from 'antd';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import {
//     ArrowLeft,
//     Stethoscope,
//     FileText,
//     TestTube,
//     Pill,
//     Receipt,
//     Save,
//     Plus,
//     Trash2,
//     CheckCircle,
//     Printer,
//     Send,
//     Edit,
//     User,
//     Calendar,
//     Clock,
//     MapPin,
//     Phone,
//     Heart,
//     AlertTriangle,
//     Activity,
// } from 'lucide-react';
// import dayjs from 'dayjs';
// import { calculateAge, formatDate } from '../../Utils/Format/FormatDate';
// import { useSelector } from 'react-redux';

// const { TextArea } = Input;

// // Dữ liệu từ JSON
// const appointmentData = {
//     appointmentId: '16e96048-fc9d-478e-74bb-08dda6a312d3',
//     appointmentCode: 'APT-03F7C096',
//     appointmentDate: '2025-06-08T00:00:00',
//     startTime: '14:00:00',
//     endTime: '16:00:00',
//     status: 'Booked',
//     note: 'Ngứa ngáy, mề đay',
//     symptoms: 'vcl',
//     patientId: 'e151a8b7-f7b8-4015-fcfb-08dda6a312bb',
//     patientName: 'Nguyễn Hải My',
//     patientPhone: '0902451769',
//     patientGender: 'Female',
//     patientDob: '2020-02-05T00:00:00',
//     doctorId: '526bebbb-4964-48cf-c88c-08dd989b54d5',
//     doctorName: 'Le Van C',
//     doctorAvatar: 'https://example.com/avatar3.jpg',
//     specialtyName: 'Da liễu',
//     services: [
//         {
//             appointmentServiceId: '13e114e2-f3b8-4283-b107-08ddaa949338',
//             serviceId: '45e44601-12e6-40b8-1aaf-08dd9a24116c',
//             serviceName: 'Thử nước tiểu',
//             serviceDescription: 'string',
//             status: 'Completed',
//             price: 120,
//             note: 'Nghi ngờ suy thận mạn',
//             testResult: {
//                 testResultId: '3b3d2f5f-5cc8-4e7c-0b5e-08ddaa95f97c',
//                 result: 'Nước tiểu đặc, có máu',
//                 resultDate: '2025-06-13T16:44:51.962',
//                 createdBy: 'labtech',
//             },
//         },
//     ],
//     prescription: {
//         prescriptionId: '13a5f4d4-52db-40b6-f494-08ddaa9fdbe3',
//         notes: 'Đơn khám này',
//         prescriptionDetails: [
//             {
//                 medicineId: '0326e26d-2e0b-48f9-2d7f-08dd9afc46f8',
//                 medicineName: 'Vitamin C',
//                 quantity: 2,
//                 dosageInstructions: '1 này/ cũ7',
//                 unit: 'Box',
//                 price: 12000,
//             },
//             {
//                 medicineId: '00d7a552-796c-476a-5bca-08dda129fe76',
//                 medicineName: 'Amoxicillin ',
//                 quantity: 1,
//                 dosageInstructions: '1 này/ cũ7',
//                 unit: 'Box',
//                 price: 190000,
//             },
//         ],
//     },
// };

// // Available lab services
// const availableLabServices = [
//     { id: 'LAB-001', name: 'Xét nghiệm máu tổng quát', price: 120000, category: 'Huyết học' },
//     { id: 'LAB-002', name: 'Điện tâm đồ (ECG)', price: 100000, category: 'Tim mạch' },
//     { id: 'LAB-003', name: 'Xét nghiệm đường huyết', price: 80000, category: 'Hóa sinh' },
//     { id: 'LAB-004', name: 'Xét nghiệm lipid máu', price: 150000, category: 'Hóa sinh' },
//     { id: 'LAB-005', name: 'Siêu âm tim', price: 300000, category: 'Hình ảnh' },
//     { id: 'LAB-006', name: 'X-quang ngực', price: 200000, category: 'Hình ảnh' },
// ];

// // Available medications
// const availableMedications = [
//     { id: 'MED-001', name: 'Amlodipine', dosages: ['2.5mg', '5mg', '10mg'], price: 3000 },
//     { id: 'MED-002', name: 'Losartan', dosages: ['25mg', '50mg', '100mg'], price: 5000 },
//     { id: 'MED-003', name: 'Metformin', dosages: ['500mg', '850mg', '1000mg'], price: 2000 },
//     { id: 'MED-004', name: 'Atorvastatin', dosages: ['10mg', '20mg', '40mg'], price: 8000 },
//     { id: 'MED-005', name: 'Aspirin', dosages: ['75mg', '100mg'], price: 1000 },
// ];

// const AppointmentDetail = ({ appointmentId, onBack }) => {
//     const { appointmentInfo, appointmentService, prescription } = useSelector(
//         state => state.AppointmentReducer
//     );
//     const [activeTab, setActiveTab] = useState('examination');

//     // Ant Design Form instances
//     const [examinationForm] = Form.useForm();
//     const [diagnosisForm] = Form.useForm();
//     const [prescriptionForm] = Form.useForm();

//     // State management
//     const [selectedLabServices, setSelectedLabServices] = useState(appointmentData.services || []);
//     const [isLabServiceDialogOpen, setIsLabServiceDialogOpen] = useState(false);
//     const [isLabServicesSaved, setIsLabServicesSaved] = useState(false);

//     const [prescriptionData, setPrescriptionData] = useState({
//         medications: appointmentData.prescription?.prescriptionDetails || [],
//         instructions: appointmentData.prescription?.notes || '',
//         isSaved: false,
//     });
//     const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);

//     const [paymentData, setPaymentData] = useState({
//         examinationFee: 200000,
//         labFees: 0,
//         medicationFees: 0,
//         total: 200000,
//     });

//     // State cho việc lưu
//     const [isExaminationSaved, setIsExaminationSaved] = useState(Boolean(appointmentInfo.symptoms));
//     const [isDiagnosisSaved, setIsDiagnosisSaved] = useState(false);
//     console.log(isExaminationSaved);

//     // Handler functions
//     const handleAddLabService = service => {
//         if (!selectedLabServices.find(s => s.serviceId === service.id)) {
//             const newService = {
//                 appointmentServiceId: Date.now().toString(),
//                 serviceId: service.id,
//                 serviceName: service.name,
//                 serviceDescription: service.category,
//                 status: 'Pending',
//                 price: service.price,
//                 note: '',
//                 testResult: null,
//             };
//             const newServices = [...selectedLabServices, newService];
//             setSelectedLabServices(newServices);
//             updatePayment(newServices, prescriptionData.medications);
//         }
//     };

//     const handleRemoveLabService = serviceId => {
//         const newServices = selectedLabServices.filter(s => s.serviceId !== serviceId);
//         setSelectedLabServices(newServices);
//         updatePayment(newServices, prescriptionData.medications);
//     };

//     const handleAddMedication = medication => {
//         const newMedications = [
//             ...prescriptionData.medications,
//             {
//                 medicineId: Date.now().toString(),
//                 medicineName: medication.name,
//                 quantity: 1,
//                 dosageInstructions: '1 viên/ngày',
//                 unit: 'Box',
//                 price: medication.price,
//             },
//         ];
//         setPrescriptionData({ ...prescriptionData, medications: newMedications });
//         updatePayment(selectedLabServices, newMedications);
//     };

//     const handleRemoveMedication = medicineId => {
//         const newMedications = prescriptionData.medications.filter(
//             m => m.medicineId !== medicineId
//         );
//         setPrescriptionData({ ...prescriptionData, medications: newMedications });
//         updatePayment(selectedLabServices, newMedications);
//     };

//     const updatePayment = (labServices, medications) => {
//         const labFees = labServices.reduce((sum, service) => sum + service.price, 0);
//         const medicationFees = medications.reduce((sum, med) => sum + med.price * med.quantity, 0);
//         const total = paymentData.examinationFee + labFees + medicationFees;

//         setPaymentData({
//             ...paymentData,
//             labFees,
//             medicationFees,
//             total,
//         });
//     };

//     const formatCurrency = amount => {
//         return new Intl.NumberFormat('vi-VN', {
//             style: 'currency',
//             currency: 'VND',
//         }).format(amount);
//     };

//     // Form handlers
//     const handleSaveExamination = values => {
//         console.log('Examination data:', values);
//         setIsExaminationSaved(true);
//         message.success('Đã lưu triệu chứng chính!');
//     };

//     const handleSaveDiagnosis = values => {
//         console.log('Diagnosis data:', values);
//         setIsDiagnosisSaved(true);
//         message.success('Đã lưu chẩn đoán!');
//     };

//     const handleSaveLabServices = () => {
//         setIsLabServicesSaved(true);
//         message.success('Đã lưu chỉ định xét nghiệm!');
//     };

//     const handleSavePrescription = values => {
//         console.log('Prescription data:', values);
//         setPrescriptionData({ ...prescriptionData, isSaved: true });
//         message.success('Đã lưu đơn thuốc!');
//     };

//     const handleCompleteTreatment = () => {
//         console.log('Completing treatment with data:', {
//             examination: examinationForm.getFieldsValue(),
//             labServices: selectedLabServices,
//             diagnosis: diagnosisForm.getFieldsValue(),
//             prescription: prescriptionData,
//             payment: paymentData,
//         });
//         message.success('Đã hoàn thành khám bệnh và tạo thanh toán!');
//     };

//     return (
//         <div className="mx-auto space-y-6">
//             {/* Enhanced Header */}
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                         <Button
//                             variant="outline"
//                             onClick={onBack}
//                             className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
//                         >
//                             <ArrowLeft className="h-4 w-4" />
//                             Quay lại
//                         </Button>
//                         <div className="border-l border-slate-200 pl-4">
//                             <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
//                                 <div className="p-2 bg-blue-100 rounded-lg">
//                                     <Stethoscope className="h-6 w-6 text-blue-600" />
//                                 </div>
//                                 Khám bệnh
//                             </h1>
//                             <p className="text-slate-600 mt-1 flex items-center gap-2">
//                                 <span className="text-sm">Mã lịch hẹn:</span>
//                                 <Badge variant="outline" className="font-mono">
//                                     {appointmentInfo.appointmentCode}
//                                 </Badge>
//                             </p>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1">
//                             <Activity className="h-3 w-3 mr-1" />
//                             Đang khám
//                         </Badge>
//                         <Button variant="outline" className="gap-2 hover:bg-slate-50">
//                             <Printer className="h-4 w-4" />
//                             In phiếu khám
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             {/* Enhanced Patient Summary Card */}
//             <Card className="border-0 border-l-4 border-l-blue-500 bg-white shadow-sm p-0">
//                 <CardContent className="px-6 py-6">
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         {/* Patient Info */}
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-3 mb-4">
//                                 <div className="p-2 bg-blue-100 rounded-lg">
//                                     <User className="h-5 w-5 text-blue-600" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-slate-900">
//                                     Thông tin bệnh nhân
//                                 </h3>
//                             </div>
//                             <div className="space-y-3">
//                                 <div className="flex items-center gap-3">
//                                     <span className="text-slate-600 min-w-[60px]">Họ tên:</span>
//                                     <span className="font-semibold text-slate-900">
//                                         {appointmentInfo.patientName}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <span className="text-slate-600 min-w-[60px]">Tuổi:</span>
//                                     <span className="font-medium text-slate-800">
//                                         {calculateAge(appointmentInfo.patientDob)} tuổi
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <span className="text-slate-600 min-w-[60px]">Giới tính:</span>
//                                     <span className="font-medium text-slate-800">
//                                         {appointmentInfo.patientGender === 'Female' ? 'Nữ' : 'Nam'}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <Phone className="h-4 w-4 text-slate-500" />
//                                     <span className="font-medium text-slate-800">
//                                         {appointmentInfo.patientPhone}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Appointment Info */}
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-3 mb-4">
//                                 <div className="p-2 bg-emerald-100 rounded-lg">
//                                     <Calendar className="h-5 w-5 text-emerald-600" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-slate-900">Lịch khám</h3>
//                             </div>
//                             <div className="space-y-3">
//                                 <div className="flex items-center gap-3">
//                                     <Calendar className="h-4 w-4 text-slate-500" />
//                                     <span className="font-medium text-slate-800">
//                                         {formatDate(appointmentInfo.appointmentDate)}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <Clock className="h-4 w-4 text-slate-500" />
//                                     <span className="font-medium text-slate-800">
//                                         {appointmentInfo.startTime.slice(0, 5)} -{' '}
//                                         {appointmentInfo.endTime.slice(0, 5)}
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <MapPin className="h-4 w-4 text-slate-500" />
//                                     <span className="font-medium text-slate-800">
//                                         Phòng khám {appointmentInfo.specialtyName}
//                                     </span>
//                                 </div>
//                                 <Badge variant="secondary" className="w-fit">
//                                     {appointmentInfo.status}
//                                 </Badge>
//                             </div>
//                         </div>

//                         {/* Medical History */}
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-3 mb-4">
//                                 <div className="p-2 bg-amber-100 rounded-lg">
//                                     <Heart className="h-5 w-5 text-amber-600" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-slate-900">Lý do khám</h3>
//                             </div>
//                             <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
//                                 {appointmentInfo.note}
//                             </p>
//                             <div>
//                                 <h4 className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
//                                     <AlertTriangle className="h-4 w-4" />
//                                     Bác sĩ phụ trách:
//                                 </h4>
//                                 <Badge
//                                     variant="outline"
//                                     className="text-xs bg-blue-50 text-blue-700 border-blue-200"
//                                 >
//                                     {appointmentInfo.doctorName} - {appointmentInfo.specialtyName}
//                                 </Badge>
//                             </div>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Enhanced Tabs */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
//                     <TabsList className="grid w-full grid-cols-5 bg-slate-50 p-1 rounded-lg">
//                         <TabsTrigger
//                             value="examination"
//                             className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
//                         >
//                             <Stethoscope className="h-4 w-4" />
//                             <span className="hidden sm:inline">Khám bệnh</span>
//                         </TabsTrigger>
//                         <TabsTrigger
//                             value="lab-services"
//                             className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
//                         >
//                             <TestTube className="h-4 w-4" />
//                             <span className="hidden sm:inline">Chỉ định XN</span>
//                         </TabsTrigger>
//                         <TabsTrigger
//                             value="diagnosis"
//                             className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
//                         >
//                             <FileText className="h-4 w-4" />
//                             <span className="hidden sm:inline">Chẩn đoán</span>
//                         </TabsTrigger>
//                         <TabsTrigger
//                             value="prescription"
//                             className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
//                         >
//                             <Pill className="h-4 w-4" />
//                             <span className="hidden sm:inline">Kê toa</span>
//                         </TabsTrigger>
//                         <TabsTrigger
//                             value="payment"
//                             className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
//                         >
//                             <Receipt className="h-4 w-4" />
//                             <span className="hidden sm:inline">Thanh toán</span>
//                         </TabsTrigger>
//                     </TabsList>
//                 </div>

//                 {/* Examination Tab */}
//                 <TabsContent value="examination">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <Card className="shadow-sm border-slate-200 p-0">
//                             <CardHeader className="py-4 bg-blue-50 rounded-t-lg flex items-center">
//                                 <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-800">
//                                     <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
//                                         <Stethoscope className="h-4 w-4 text-blue-600" />
//                                     </div>
//                                     Ghi chú triệu chứng chính
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="px-6 pb-6 space-y-4">
//                                 <Form
//                                     form={examinationForm}
//                                     layout="vertical"
//                                     onFinish={handleSaveExamination}
//                                     initialValues={{
//                                         symptoms: appointmentInfo.symptoms || '',
//                                     }}
//                                 >
//                                     <Form.Item
//                                         label={
//                                             <span className="font-medium text-gray-700">
//                                                 Triệu chứng khám
//                                             </span>
//                                         }
//                                         name="symptoms"
//                                         rules={[
//                                             {
//                                                 required: true,
//                                                 message: 'Vui lòng nhập triệu chứng chính!',
//                                             },
//                                         ]}
//                                     >
//                                         <TextArea
//                                             rows={4}
//                                             placeholder="Mô tả triệu chứng chính của bệnh nhân..."
//                                             className="resize-none text-sm"
//                                             disabled={isExaminationSaved}
//                                         />
//                                     </Form.Item>
//                                 </Form>
//                                 <div className="pt-2">
//                                     {!isExaminationSaved ? (
//                                         <Button
//                                             onClick={() => examinationForm.submit()}
//                                             className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
//                                         >
//                                             <Save className="h-4 w-4" />
//                                             Lưu triệu chứng
//                                         </Button>
//                                     ) : (
//                                         <Button
//                                             onClick={() => setIsExaminationSaved(false)}
//                                             className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
//                                         >
//                                             <Edit className="h-4 w-4" />
//                                             Chỉnh sửa
//                                         </Button>
//                                     )}
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         {appointmentInfo.symptoms && (
//                             <Card className="shadow-sm border-emerald-200 p-0">
//                                 <CardHeader className="py-4 bg-emerald-50 rounded-t-lg flex items-center">
//                                     <CardTitle className="flex items-center gap-3 text-base font-semibold text-emerald-800">
//                                         <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100">
//                                             <CheckCircle className="h-4 w-4 text-emerald-600" />
//                                         </div>
//                                         Thông tin đã lưu
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="pt-4 px-6 pb-6">
//                                     <div className="space-y-4">
//                                         <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
//                                             <Label className="text-emerald-800 font-medium text-sm block mb-1 mt-2">
//                                                 Triệu chứng:
//                                             </Label>
//                                             <p className="text-emerald-700 text-sm leading-relaxed">
//                                                 {appointmentInfo.symptoms}
//                                             </p>
//                                         </div>
//                                         <div className="flex items-center gap-4 text-xs text-emerald-700">
//                                             <div className="flex items-center gap-1">
//                                                 <CheckCircle className="h-3 w-3" />
//                                                 <span>Đã lưu thông tin khám bệnh</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         )}
//                     </div>
//                 </TabsContent>

//                 {/* Lab Services Tab */}
//                 <TabsContent value="lab-services">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <Card className="shadow-sm border-slate-200">
//                             <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
//                                 <div className="flex items-center justify-between">
//                                     <CardTitle className="flex items-center gap-3">
//                                         <div className="p-2 bg-purple-100 rounded-lg">
//                                             <TestTube className="h-5 w-5 text-purple-600" />
//                                         </div>
//                                         Dịch vụ đã chỉ định
//                                     </CardTitle>
//                                     {appointmentService.length == 0 ? (
//                                         <Button
//                                             onClick={() => setIsLabServiceDialogOpen(true)}
//                                             className="gap-2 bg-purple-600 hover:bg-purple-700"
//                                         >
//                                             <Plus className="h-4 w-4" />
//                                             Thêm xét nghiệm
//                                         </Button>
//                                     ) : (
//                                         <Button
//                                             onClick={() => setIsLabServicesSaved(false)}
//                                             variant="outline"
//                                             className="gap-2"
//                                         >
//                                             <Edit className="h-4 w-4" />
//                                             Chỉnh sửa
//                                         </Button>
//                                     )}
//                                 </div>
//                             </CardHeader>
//                             <CardContent className="p-6">
//                                 {appointmentService.length > 0 ? (
//                                     <div className="space-y-4">
//                                         {appointmentService.map(service => (
//                                             <div
//                                                 key={service.appointmentServiceId}
//                                                 className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
//                                             >
//                                                 <div className="flex-1">
//                                                     <p className="font-semibold text-slate-900">
//                                                         {service.serviceName}
//                                                     </p>
//                                                     <p className="text-sm text-slate-600 mt-1">
//                                                         {service.serviceDescription}
//                                                     </p>
//                                                     <p className="text-lg font-bold text-emerald-600 mt-2">
//                                                         {formatCurrency(service.price)}
//                                                     </p>
//                                                     {service.status && (
//                                                         <Badge
//                                                             className={`mt-2 ${
//                                                                 service.status === 'Completed'
//                                                                     ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
//                                                                     : 'bg-orange-100 text-orange-800 border-orange-200'
//                                                             }`}
//                                                         >
//                                                             {service.status === 'Completed'
//                                                                 ? 'Đã hoàn thành'
//                                                                 : 'Đang chờ'}
//                                                         </Badge>
//                                                     )}
//                                                     {service.testResult && (
//                                                         <div className="mt-3 p-3 bg-gray-50 rounded">
//                                                             <Label className="text-xs text-slate-600 font-medium">
//                                                                 Kết quả:
//                                                             </Label>
//                                                             <p className="text-sm text-slate-800 mt-1 leading-relaxed">
//                                                                 {service.testResult.result}
//                                                             </p>
//                                                             <p className="text-xs text-slate-600 mt-1">
//                                                                 Ngày:{' '}
//                                                                 {dayjs(
//                                                                     service.testResult.resultDate
//                                                                 ).format('DD/MM/YYYY HH:mm')}{' '}
//                                                                 - Người thực hiện:{' '}
//                                                                 {service.testResult.createdBy}
//                                                             </p>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 {!isLabServicesSaved && (
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         onClick={() =>
//                                                             handleRemoveLabService(
//                                                                 service.serviceId
//                                                             )
//                                                         }
//                                                         className="text-red-600 hover:bg-red-50 hover:border-red-200"
//                                                     >
//                                                         <Trash2 className="h-4 w-4" />
//                                                     </Button>
//                                                 )}
//                                             </div>
//                                         ))}
//                                         {!isLabServicesSaved && (
//                                             <Button
//                                                 onClick={handleSaveLabServices}
//                                                 className="gap-2 mt-4 w-full bg-purple-600 hover:bg-purple-700"
//                                                 disabled={appointmentService.length === 0}
//                                             >
//                                                 <Save className="h-4 w-4" />
//                                                 Lưu chỉ định xét nghiệm
//                                             </Button>
//                                         )}
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-12">
//                                         <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
//                                             <TestTube className="h-8 w-8 text-slate-400" />
//                                         </div>
//                                         <p className="text-slate-500 text-lg">
//                                             Chưa chỉ định xét nghiệm nào
//                                         </p>
//                                         <p className="text-slate-400 text-sm mt-1">
//                                             Nhấn "Thêm xét nghiệm" để bắt đầu
//                                         </p>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>

//                         <Card className="shadow-sm border-slate-200">
//                             <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
//                                 <CardTitle className="flex items-center gap-3">
//                                     <div className="p-2 bg-slate-100 rounded-lg">
//                                         <Activity className="h-5 w-5 text-slate-600" />
//                                     </div>
//                                     Lịch sử kết quả xét nghiệm
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="p-6">
//                                 <div className="space-y-4">
//                                     {appointmentService?.map(service => (
//                                         <div
//                                             key={service.appointmentServiceId}
//                                             className="p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-slate-50 to-gray-50"
//                                         >
//                                             <div className="flex items-start justify-between mb-3">
//                                                 <div className="flex-1">
//                                                     <p className="font-semibold text-slate-900">
//                                                         {service.serviceName}
//                                                     </p>
//                                                     <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
//                                                         <User className="h-3 w-3" />
//                                                         Người XN:{' '}
//                                                         {service.testResult?.createdBy ||
//                                                             'Chưa thực hiện'}
//                                                         <Calendar className="h-3 w-3 ml-2" />
//                                                         {service.testResult
//                                                             ? dayjs(
//                                                                   service.testResult.resultDate
//                                                               ).format('DD/MM/YYYY')
//                                                             : 'Chưa có'}
//                                                     </p>
//                                                 </div>
//                                                 <Badge
//                                                     className={`${
//                                                         service.status === 'Completed'
//                                                             ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
//                                                             : 'bg-orange-100 text-orange-800 border-orange-200'
//                                                     }`}
//                                                 >
//                                                     <CheckCircle className="h-3 w-3 mr-1" />
//                                                     {service.status === 'Completed'
//                                                         ? 'Đã có kết quả'
//                                                         : 'Đang chờ'}
//                                                 </Badge>
//                                             </div>
//                                             {service.testResult && (
//                                                 <div className="bg-white p-3 rounded-lg border border-slate-200">
//                                                     <Label className="text-xs text-slate-600 font-medium">
//                                                         Kết quả:
//                                                     </Label>
//                                                     <p className="text-sm text-slate-800 mt-1 leading-relaxed">
//                                                         {service.testResult.result}
//                                                     </p>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </TabsContent>

//                 {/* Diagnosis Tab */}
//                 <TabsContent value="diagnosis">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <Card className="shadow-sm border-slate-200">
//                             <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
//                                 <CardTitle className="flex items-center gap-3">
//                                     <div className="p-2 bg-orange-100 rounded-lg">
//                                         <FileText className="h-5 w-5 text-orange-600" />
//                                     </div>
//                                     Chẩn đoán
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="p-6 space-y-4">
//                                 <Form
//                                     form={diagnosisForm}
//                                     layout="vertical"
//                                     onFinish={handleSaveDiagnosis}
//                                 >
//                                     <Form.Item
//                                         label="Ghi chú chẩn đoán"
//                                         name="diagnosisNotes"
//                                         rules={[
//                                             { required: true, message: 'Vui lòng nhập chẩn đoán!' },
//                                         ]}
//                                     >
//                                         <TextArea
//                                             rows={8}
//                                             placeholder="Nhập chẩn đoán, kết luận và hướng điều trị..."
//                                             disabled={isDiagnosisSaved}
//                                             className="resize-none focus:ring-2 focus:ring-orange-500"
//                                         />
//                                     </Form.Item>
//                                 </Form>
//                                 <div className="flex gap-3">
//                                     {!isDiagnosisSaved ? (
//                                         <Button
//                                             onClick={() => diagnosisForm.submit()}
//                                             className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
//                                         >
//                                             <Save className="h-4 w-4" />
//                                             Lưu chẩn đoán
//                                         </Button>
//                                     ) : (
//                                         <Button
//                                             onClick={() => setIsExaminationSaved(false)}
//                                             className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
//                                         >
//                                             <Edit className="h-4 w-4" />
//                                             Chỉnh sửa
//                                         </Button>
//                                     )}
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         {isDiagnosisSaved && (
//                             <Card className="shadow-sm border-emerald-200 bg-emerald-50/30">
//                                 <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
//                                     <CardTitle className="flex items-center gap-3 text-emerald-800">
//                                         <div className="p-2 bg-emerald-100 rounded-lg">
//                                             <CheckCircle className="h-5 w-5 text-emerald-600" />
//                                         </div>
//                                         Chẩn đoán đã lưu
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="p-6">
//                                     <div className="space-y-4">
//                                         <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
//                                             <Label className="text-emerald-800 font-semibold text-sm">
//                                                 Chẩn đoán:
//                                             </Label>
//                                             <p className="text-emerald-700 mt-2 whitespace-pre-wrap leading-relaxed">
//                                                 {diagnosisForm.getFieldValue('diagnosisNotes')}
//                                             </p>
//                                         </div>
//                                         <div className="flex items-center gap-4 text-sm text-emerald-700">
//                                             <div className="flex items-center gap-2">
//                                                 <CheckCircle className="h-4 w-4" />
//                                                 <span>Đã lưu chẩn đoán</span>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <Clock className="h-4 w-4" />
//                                                 <span>{dayjs().format('HH:mm:ss DD/MM/YYYY')}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         )}
//                     </div>
//                 </TabsContent>

//                 {/* Prescription Tab */}
//                 <TabsContent value="prescription">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <Card className="shadow-sm border-slate-200">
//                             <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
//                                 <div className="flex items-center justify-between">
//                                     <CardTitle className="flex items-center gap-3">
//                                         <div className="p-2 bg-green-100 rounded-lg">
//                                             <Pill className="h-5 w-5 text-green-600" />
//                                         </div>
//                                         Đơn thuốc
//                                     </CardTitle>
//                                     {!prescriptionData.isSaved ? (
//                                         <Button
//                                             onClick={() => setIsPrescriptionDialogOpen(true)}
//                                             className="gap-2 bg-green-600 hover:bg-green-700"
//                                         >
//                                             <Plus className="h-4 w-4" />
//                                             Thêm thuốc
//                                         </Button>
//                                     ) : (
//                                         <Button
//                                             onClick={() =>
//                                                 setPrescriptionData({
//                                                     ...prescriptionData,
//                                                     isSaved: false,
//                                                 })
//                                             }
//                                             variant="outline"
//                                             className="gap-2"
//                                         >
//                                             <Edit className="h-4 w-4" />
//                                             Chỉnh sửa
//                                         </Button>
//                                     )}
//                                 </div>
//                             </CardHeader>
//                             <CardContent className="p-6">
//                                 {prescriptionData.medications.length > 0 ? (
//                                     <div className="space-y-4">
//                                         {prescriptionData.medications.map(medication => (
//                                             <div
//                                                 key={medication.medicineId}
//                                                 className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
//                                             >
//                                                 <div className="flex items-start justify-between">
//                                                     <div className="flex-1 space-y-2">
//                                                         <p className="font-semibold text-slate-900 text-lg">
//                                                             {medication.medicineName}
//                                                         </p>
//                                                         <div className="grid grid-cols-2 gap-4 text-sm">
//                                                             <div>
//                                                                 <span className="text-slate-600">
//                                                                     Số lượng:
//                                                                 </span>
//                                                                 <span className="ml-2 font-medium">
//                                                                     {medication.quantity}{' '}
//                                                                     {medication.unit}
//                                                                 </span>
//                                                             </div>
//                                                             <div>
//                                                                 <span className="text-slate-600">
//                                                                     Cách dùng:
//                                                                 </span>
//                                                                 <span className="ml-2 font-medium">
//                                                                     {medication.dosageInstructions}
//                                                                 </span>
//                                                             </div>
//                                                             <div className="col-span-2">
//                                                                 <span className="text-slate-600">
//                                                                     Thành tiền:
//                                                                 </span>
//                                                                 <span className="ml-2 font-bold text-emerald-600">
//                                                                     {formatCurrency(
//                                                                         medication.price *
//                                                                             medication.quantity
//                                                                     )}
//                                                                 </span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     {!prescriptionData.isSaved && (
//                                                         <Button
//                                                             variant="outline"
//                                                             size="sm"
//                                                             onClick={() =>
//                                                                 handleRemoveMedication(
//                                                                     medication.medicineId
//                                                                 )
//                                                             }
//                                                             className="text-red-600 hover:bg-red-50 hover:border-red-200"
//                                                         >
//                                                             <Trash2 className="h-4 w-4" />
//                                                         </Button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                         {!prescriptionData.isSaved && (
//                                             <Form
//                                                 form={prescriptionForm}
//                                                 onFinish={handleSavePrescription}
//                                             >
//                                                 <Button
//                                                     onClick={() => prescriptionForm.submit()}
//                                                     className="gap-2 mt-4 w-full bg-green-600 hover:bg-green-700"
//                                                     disabled={
//                                                         prescriptionData.medications.length === 0
//                                                     }
//                                                 >
//                                                     <Save className="h-4 w-4" />
//                                                     Lưu đơn thuốc
//                                                 </Button>
//                                             </Form>
//                                         )}
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-12">
//                                         <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
//                                             <Pill className="h-8 w-8 text-slate-400" />
//                                         </div>
//                                         <p className="text-slate-500 text-lg">
//                                             Chưa kê toa thuốc nào
//                                         </p>
//                                         <p className="text-slate-400 text-sm mt-1">
//                                             Nhấn "Thêm thuốc" để bắt đầu
//                                         </p>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>

//                         <Card className="shadow-sm border-slate-200">
//                             <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
//                                 <CardTitle className="flex items-center gap-3">
//                                     <div className="p-2 bg-blue-100 rounded-lg">
//                                         <FileText className="h-5 w-5 text-blue-600" />
//                                     </div>
//                                     Hướng dẫn sử dụng thuốc
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="p-6 space-y-4">
//                                 <Form
//                                     form={prescriptionForm}
//                                     layout="vertical"
//                                     initialValues={{
//                                         instructions: prescriptionData.instructions,
//                                     }}
//                                 >
//                                     <Form.Item label="Hướng dẫn sử dụng thuốc" name="instructions">
//                                         <TextArea
//                                             rows={6}
//                                             placeholder="Hướng dẫn cách sử dụng thuốc, lưu ý đặc biệt..."
//                                             disabled={prescriptionData.isSaved}
//                                             className="resize-none focus:ring-2 focus:ring-blue-500"
//                                             onChange={e =>
//                                                 setPrescriptionData({
//                                                     ...prescriptionData,
//                                                     instructions: e.target.value,
//                                                 })
//                                             }
//                                         />
//                                     </Form.Item>
//                                 </Form>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </TabsContent>

//                 {/* Payment Tab */}
//                 <TabsContent value="payment">
//                     <Card className="shadow-sm border-slate-200">
//                         <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
//                             <CardTitle className="flex items-center gap-3">
//                                 <div className="p-2 bg-emerald-100 rounded-lg">
//                                     <Receipt className="h-5 w-5 text-emerald-600" />
//                                 </div>
//                                 Tổng kết và thanh toán
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-8 space-y-8">
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                                 <div className="space-y-6">
//                                     <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
//                                         <Receipt className="h-5 w-5" />
//                                         Chi tiết chi phí
//                                     </h3>
//                                     <div className="space-y-4">
//                                         <div className="flex justify-between items-center py-3 border-b border-slate-200">
//                                             <span className="text-slate-700">Phí khám bệnh</span>
//                                             <span className="font-semibold text-lg">
//                                                 {formatCurrency(paymentData.examinationFee)}
//                                             </span>
//                                         </div>
//                                         <div className="flex justify-between items-center py-3 border-b border-slate-200">
//                                             <span className="text-slate-700">
//                                                 Phí xét nghiệm ({selectedLabServices.length} dịch
//                                                 vụ)
//                                             </span>
//                                             <span className="font-semibold text-lg">
//                                                 {formatCurrency(paymentData.labFees)}
//                                             </span>
//                                         </div>
//                                         <div className="flex justify-between items-center py-3 border-b border-slate-200">
//                                             <span className="text-slate-700">
//                                                 Tiền thuốc ({prescriptionData.medications.length}{' '}
//                                                 loại)
//                                             </span>
//                                             <span className="font-semibold text-lg">
//                                                 {formatCurrency(paymentData.medicationFees)}
//                                             </span>
//                                         </div>
//                                         <div className="flex justify-between items-center py-4 border-t-2 border-emerald-200 bg-emerald-50 rounded-lg px-4">
//                                             <span className="text-xl font-bold text-slate-900">
//                                                 Tổng cộng
//                                             </span>
//                                             <span className="text-2xl font-bold text-emerald-600">
//                                                 {formatCurrency(paymentData.total)}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-6">
//                                     <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
//                                         <FileText className="h-5 w-5" />
//                                         Tóm tắt điều trị
//                                     </h3>
//                                     <div className="space-y-4">
//                                         <div className="p-4 bg-slate-50 rounded-lg">
//                                             <span className="font-semibold text-slate-700 block mb-2">
//                                                 Chẩn đoán:
//                                             </span>
//                                             <p className="text-slate-800 leading-relaxed">
//                                                 {diagnosisForm.getFieldValue('diagnosisNotes') ||
//                                                     'Chưa có chẩn đoán'}
//                                             </p>
//                                         </div>
//                                         <div className="p-4 bg-slate-50 rounded-lg">
//                                             <span className="font-semibold text-slate-700 block mb-2">
//                                                 Xét nghiệm đã chỉ định:
//                                             </span>
//                                             <p className="text-slate-800">
//                                                 {selectedLabServices.length > 0
//                                                     ? selectedLabServices
//                                                           .map(s => s.serviceName)
//                                                           .join(', ')
//                                                     : 'Không có'}
//                                             </p>
//                                         </div>
//                                         <div className="p-4 bg-slate-50 rounded-lg">
//                                             <span className="font-semibold text-slate-700 block mb-2">
//                                                 Thuốc đã kê:
//                                             </span>
//                                             <p className="text-slate-800">
//                                                 {prescriptionData.medications.length > 0
//                                                     ? prescriptionData.medications
//                                                           .map(m => m.medicineName)
//                                                           .join(', ')
//                                                     : 'Không có'}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex gap-4 pt-8 border-t border-slate-200">
//                                 <Button
//                                     onClick={handleCompleteTreatment}
//                                     className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-lg py-3"
//                                 >
//                                     <CheckCircle className="h-5 w-5" />
//                                     Hoàn thành khám bệnh
//                                 </Button>
//                                 <Button variant="outline" className="gap-2 px-6">
//                                     <Printer className="h-4 w-4" />
//                                     In toa thuốc
//                                 </Button>
//                                 <Button variant="outline" className="gap-2 px-6">
//                                     <Send className="h-4 w-4" />
//                                     Gửi kết quả
//                                 </Button>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>

//             {/* Lab Service Selection Dialog */}
//             <Dialog open={isLabServiceDialogOpen} onOpenChange={setIsLabServiceDialogOpen}>
//                 <DialogContent className="max-w-3xl">
//                     <DialogHeader>
//                         <DialogTitle className="text-xl flex items-center gap-2">
//                             <TestTube className="h-5 w-5" />
//                             Chỉ định xét nghiệm
//                         </DialogTitle>
//                         <DialogDescription>
//                             Chọn các dịch vụ xét nghiệm cần thiết cho bệnh nhân
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-4 max-h-96 overflow-y-auto">
//                         {availableLabServices.map(service => (
//                             <div
//                                 key={service.id}
//                                 className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
//                             >
//                                 <div className="flex items-center space-x-4">
//                                     <Checkbox
//                                         checked={selectedLabServices.some(
//                                             s => s.serviceId === service.id
//                                         )}
//                                         onCheckedChange={checked => {
//                                             if (checked) {
//                                                 handleAddLabService(service);
//                                             } else {
//                                                 handleRemoveLabService(service.id);
//                                             }
//                                         }}
//                                         className="data-[state=checked]:bg-purple-600"
//                                     />
//                                     <div>
//                                         <p className="font-semibold text-slate-900">
//                                             {service.name}
//                                         </p>
//                                         <Badge variant="secondary" className="text-xs mt-1">
//                                             {service.category}
//                                         </Badge>
//                                     </div>
//                                 </div>
//                                 <span className="font-bold text-emerald-600 text-lg">
//                                     {formatCurrency(service.price)}
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//                     <DialogFooter>
//                         <Button
//                             variant="outline"
//                             onClick={() => setIsLabServiceDialogOpen(false)}
//                             className="px-6"
//                         >
//                             Đóng
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Medication Selection Dialog */}
//             <Dialog open={isPrescriptionDialogOpen} onOpenChange={setIsPrescriptionDialogOpen}>
//                 <DialogContent className="max-w-3xl">
//                     <DialogHeader>
//                         <DialogTitle className="text-xl flex items-center gap-2">
//                             <Pill className="h-5 w-5" />
//                             Kê toa thuốc
//                         </DialogTitle>
//                         <DialogDescription>Chọn thuốc cần kê cho bệnh nhân</DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-4 max-h-96 overflow-y-auto">
//                         {availableMedications.map(medication => (
//                             <div
//                                 key={medication.id}
//                                 className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
//                             >
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="font-semibold text-slate-900 text-lg">
//                                             {medication.name}
//                                         </p>
//                                         <p className="text-slate-600 mt-1">
//                                             Giá: {formatCurrency(medication.price)}/viên
//                                         </p>
//                                         <div className="flex gap-2 mt-2">
//                                             {medication.dosages.map(dosage => (
//                                                 <Badge
//                                                     key={dosage}
//                                                     variant="outline"
//                                                     className="text-xs"
//                                                 >
//                                                     {dosage}
//                                                 </Badge>
//                                             ))}
//                                         </div>
//                                     </div>
//                                     <Button
//                                         onClick={() =>
//                                             handleAddMedication({
//                                                 ...medication,
//                                                 dosage: medication.dosages[0],
//                                             })
//                                         }
//                                         className="gap-2 bg-green-600 hover:bg-green-700"
//                                     >
//                                         <Plus className="h-4 w-4" />
//                                         Thêm
//                                     </Button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                     <DialogFooter>
//                         <Button
//                             variant="outline"
//                             onClick={() => setIsPrescriptionDialogOpen(false)}
//                             className="px-6"
//                         >
//                             Đóng
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default AppointmentDetail;

'use client';
import { useState } from 'react';
import { Form, Input, message } from 'antd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    ArrowLeft,
    Stethoscope,
    FileText,
    TestTube,
    Pill,
    Receipt,
    Save,
    Plus,
    Trash2,
    CheckCircle,
    Printer,
    Send,
    Edit,
    User,
    Calendar,
    Clock,
    MapPin,
    Phone,
    Heart,
    AlertTriangle,
    Activity,
} from 'lucide-react';
import dayjs from 'dayjs';
import { calculateAge, formatDate } from '../../Utils/Format/FormatDate';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

// Available lab services
const availableLabServices = [
    { id: 'LAB-001', name: 'Xét nghiệm máu tổng quát', price: 120000, category: 'Huyết học' },
    { id: 'LAB-002', name: 'Điện tâm đồ (ECG)', price: 100000, category: 'Tim mạch' },
    { id: 'LAB-003', name: 'Xét nghiệm đường huyết', price: 80000, category: 'Hóa sinh' },
    { id: 'LAB-004', name: 'Xét nghiệm lipid máu', price: 150000, category: 'Hóa sinh' },
    { id: 'LAB-005', name: 'Siêu âm tim', price: 300000, category: 'Hình ảnh' },
    { id: 'LAB-006', name: 'X-quang ngực', price: 200000, category: 'Hình ảnh' },
];

// Available medications
const availableMedications = [
    { id: 'MED-001', name: 'Amlodipine', dosages: ['2.5mg', '5mg', '10mg'], price: 3000 },
    { id: 'MED-002', name: 'Losartan', dosages: ['25mg', '50mg', '100mg'], price: 5000 },
    { id: 'MED-003', name: 'Metformin', dosages: ['500mg', '850mg', '1000mg'], price: 2000 },
    { id: 'MED-004', name: 'Atorvastatin', dosages: ['10mg', '20mg', '40mg'], price: 8000 },
    { id: 'MED-005', name: 'Aspirin', dosages: ['75mg', '100mg'], price: 1000 },
];

const AppointmentDetail = ({ appointmentId, onBack }) => {
    const { appointmentInfo, appointmentService, prescription } = useSelector(
        state => state.AppointmentReducer
    );
    const [activeTab, setActiveTab] = useState('examination');

    // Ant Design Form instances
    const [examinationForm] = Form.useForm();
    const [diagnosisForm] = Form.useForm();
    const [prescriptionForm] = Form.useForm();

    // State management
    const [selectedLabServices, setSelectedLabServices] = useState(appointmentService || []);
    const [isLabServiceDialogOpen, setIsLabServiceDialogOpen] = useState(false);
    const [isLabServicesSaved, setIsLabServicesSaved] = useState(false);

    const [prescriptionData, setPrescriptionData] = useState({
        medications: prescription?.prescriptionDetails || [],
        instructions: prescription?.notes || '',
        isSaved: false,
    });
    const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);

    const [paymentData, setPaymentData] = useState({
        examinationFee: 200000,
        labFees: 0,
        medicationFees: 0,
        total: 200000,
    });

    // State cho việc lưu
    const [isExaminationSaved, setIsExaminationSaved] = useState(Boolean(appointmentInfo.symptoms));
    const [isDiagnosisSaved, setIsDiagnosisSaved] = useState(
        Boolean(appointmentInfo.generalConclusion)
    );
    console.log(isExaminationSaved);

    // Handler functions
    const handleAddLabService = service => {
        if (!selectedLabServices.find(s => s.serviceId === service.id)) {
            const newService = {
                appointmentServiceId: Date.now().toString(),
                serviceId: service.id,
                serviceName: service.name,
                serviceDescription: service.category,
                status: 'Pending',
                price: service.price,
                note: '',
                testResult: null,
            };
            const newServices = [...selectedLabServices, newService];
            setSelectedLabServices(newServices);
            updatePayment(newServices, prescriptionData.medications);
        }
    };

    const handleRemoveLabService = serviceId => {
        const newServices = selectedLabServices.filter(s => s.serviceId !== serviceId);
        setSelectedLabServices(newServices);
        updatePayment(newServices, prescriptionData.medications);
    };

    const handleAddMedication = medication => {
        const newMedications = [
            ...prescriptionData.medications,
            {
                medicineId: Date.now().toString(),
                medicineName: medication.name,
                quantity: 1,
                dosageInstructions: '1 viên/ngày',
                unit: 'Box',
                price: medication.price,
            },
        ];
        setPrescriptionData({ ...prescriptionData, medications: newMedications });
        updatePayment(selectedLabServices, newMedications);
    };

    const handleRemoveMedication = medicineId => {
        const newMedications = prescriptionData.medications.filter(
            m => m.medicineId !== medicineId
        );
        setPrescriptionData({ ...prescriptionData, medications: newMedications });
        updatePayment(selectedLabServices, newMedications);
    };

    const updatePayment = (labServices, medications) => {
        const labFees = labServices.reduce((sum, service) => sum + service.price, 0);
        const medicationFees = medications.reduce((sum, med) => sum + med.price * med.quantity, 0);
        const total = paymentData.examinationFee + labFees + medicationFees;

        setPaymentData({
            ...paymentData,
            labFees,
            medicationFees,
            total,
        });
    };

    const formatCurrency = amount => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Form handlers
    const handleSaveExamination = values => {
        console.log('Examination data:', values);
        setIsExaminationSaved(true);
        message.success('Đã lưu triệu chứng chính!');
    };

    const handleSaveDiagnosis = values => {
        console.log('Diagnosis data:', values);
        setIsDiagnosisSaved(true);
        message.success('Đã lưu kết luận cuối cùng!');
    };

    const handleSaveLabServices = () => {
        setIsLabServicesSaved(true);
        message.success('Đã lưu chỉ định xét nghiệm!');
    };

    const handleSavePrescription = values => {
        console.log('Prescription data:', values);
        setPrescriptionData({ ...prescriptionData, isSaved: true });
        message.success('Đã lưu đơn thuốc!');
    };

    const handleCompleteTreatment = () => {
        console.log('Completing treatment with data:', {
            examination: examinationForm.getFieldsValue(),
            labServices: selectedLabServices,
            diagnosis: diagnosisForm.getFieldsValue(),
            prescription: prescriptionData,
            payment: paymentData,
        });
        message.success('Đã hoàn thành khám bệnh và tạo thanh toán!');
    };

    return (
        <div className="mx-auto space-y-6">
            {/* Enhanced Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={onBack}
                            className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại
                        </Button>
                        <div className="border-l border-slate-200 pl-4">
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Stethoscope className="h-6 w-6 text-blue-600" />
                                </div>
                                Khám bệnh
                            </h1>
                            <p className="text-slate-600 mt-1 flex items-center gap-2">
                                <span className="text-sm">Mã lịch hẹn:</span>
                                <Badge variant="outline" className="font-mono">
                                    {appointmentInfo.appointmentCode}
                                </Badge>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1">
                            <Activity className="h-3 w-3 mr-1" />
                            Đang khám
                        </Badge>
                        <Button variant="outline" className="gap-2 hover:bg-slate-50">
                            <Printer className="h-4 w-4" />
                            In phiếu khám
                        </Button>
                    </div>
                </div>
            </div>

            {/* Enhanced Patient Summary Card */}
            <Card className="border-0 border-l-4 border-l-blue-500 bg-white shadow-sm p-0">
                <CardContent className="px-6 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Patient Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Thông tin bệnh nhân
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-600 min-w-[60px]">Họ tên:</span>
                                    <span className="font-semibold text-slate-900">
                                        {appointmentInfo.patientName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-600 min-w-[60px]">Tuổi:</span>
                                    <span className="font-medium text-slate-800">
                                        {calculateAge(appointmentInfo.patientDob)} tuổi
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-600 min-w-[60px]">Giới tính:</span>
                                    <span className="font-medium text-slate-800">
                                        {appointmentInfo.patientGender === 'Female' ? 'Nữ' : 'Nam'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-slate-500" />
                                    <span className="font-medium text-slate-800">
                                        {appointmentInfo.patientPhone}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Calendar className="h-5 w-5 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Lịch khám</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    <span className="font-medium text-slate-800">
                                        {formatDate(appointmentInfo.appointmentDate)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-slate-500" />
                                    <span className="font-medium text-slate-800">
                                        {appointmentInfo.startTime.slice(0, 5)} -{' '}
                                        {appointmentInfo.endTime.slice(0, 5)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-slate-500" />
                                    <span className="font-medium text-slate-800">
                                        Phòng khám {appointmentInfo.specialtyName}
                                    </span>
                                </div>
                                <Badge variant="secondary" className="w-fit">
                                    {appointmentInfo.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Medical History */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Heart className="h-5 w-5 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Lý do khám</h3>
                            </div>
                            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">
                                {appointmentInfo.note}
                            </p>
                            <div>
                                <h4 className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Bác sĩ phụ trách:
                                </h4>
                                <Badge
                                    variant="outline"
                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                    {appointmentInfo.doctorName} - {appointmentInfo.specialtyName}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Enhanced Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
                    <TabsList className="grid w-full grid-cols-5 bg-slate-50 p-1 rounded-lg">
                        <TabsTrigger
                            value="examination"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            <Stethoscope className="h-4 w-4" />
                            <span className="hidden sm:inline">Khám bệnh</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="lab-services"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            <TestTube className="h-4 w-4" />
                            <span className="hidden sm:inline">Chỉ định XN</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="diagnosis"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">Kết luận</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="prescription"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            <Pill className="h-4 w-4" />
                            <span className="hidden sm:inline">Kê toa</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="payment"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            <Receipt className="h-4 w-4" />
                            <span className="hidden sm:inline">Thanh toán</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Examination Tab */}
                <TabsContent value="examination">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-sm border-slate-200 p-0">
                            <CardHeader className="py-4 bg-blue-50 rounded-t-lg flex items-center">
                                <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-800">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                                        <Stethoscope className="h-4 w-4 text-blue-600" />
                                    </div>
                                    Ghi chú triệu chứng chính
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 space-y-4">
                                <Form
                                    form={examinationForm}
                                    layout="vertical"
                                    onFinish={handleSaveExamination}
                                    initialValues={{
                                        symptoms: appointmentInfo.symptoms || '',
                                    }}
                                >
                                    <Form.Item
                                        label={
                                            <span className="font-medium text-gray-700">
                                                Triệu chứng khám
                                            </span>
                                        }
                                        name="symptoms"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập triệu chứng chính!',
                                            },
                                        ]}
                                    >
                                        <TextArea
                                            rows={4}
                                            placeholder="Mô tả triệu chứng chính của bệnh nhân..."
                                            className="resize-none text-sm"
                                            disabled={isExaminationSaved}
                                        />
                                    </Form.Item>
                                </Form>
                                <div className="pt-2">
                                    {!isExaminationSaved ? (
                                        <Button
                                            onClick={() => examinationForm.submit()}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            <Save className="h-4 w-4" />
                                            Lưu triệu chứng
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setIsExaminationSaved(false)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Chỉnh sửa
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {appointmentInfo.symptoms && (
                            <Card className="shadow-sm border-emerald-200 p-0">
                                <CardHeader className="py-4 bg-emerald-50 rounded-t-lg flex items-center">
                                    <CardTitle className="flex items-center gap-3 text-base font-semibold text-emerald-800">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100">
                                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        Thông tin đã lưu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 px-6 pb-6">
                                    <div className="space-y-4">
                                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                            <Label className="text-emerald-800 font-medium text-sm block mb-1 mt-2">
                                                Triệu chứng:
                                            </Label>
                                            <p className="text-emerald-700 text-sm leading-relaxed">
                                                {appointmentInfo.symptoms}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-emerald-700">
                                            <div className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                <span>Đã lưu thông tin khám bệnh</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Lab Services Tab */}
                <TabsContent value="lab-services">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <TestTube className="h-5 w-5 text-purple-600" />
                                        </div>
                                        Dịch vụ đã chỉ định
                                    </CardTitle>
                                    {appointmentService.length == 0 ? (
                                        <Button
                                            onClick={() => setIsLabServiceDialogOpen(true)}
                                            className="gap-2 bg-purple-600 hover:bg-purple-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Thêm xét nghiệm
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setIsLabServicesSaved(false)}
                                            variant="outline"
                                            className="gap-2"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Chỉnh sửa
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {appointmentService.length > 0 ? (
                                    <div className="space-y-4">
                                        {appointmentService.map(service => (
                                            <div
                                                key={service.appointmentServiceId}
                                                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900">
                                                        {service.serviceName}
                                                    </p>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        {service.serviceDescription}
                                                    </p>
                                                    <p className="text-lg font-bold text-emerald-600 mt-2">
                                                        {formatCurrency(service.price)}
                                                    </p>
                                                    {service.status && (
                                                        <Badge
                                                            className={`mt-2 ${
                                                                service.status === 'Completed'
                                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                                    : 'bg-orange-100 text-orange-800 border-orange-200'
                                                            }`}
                                                        >
                                                            {service.status === 'Completed'
                                                                ? 'Đã hoàn thành'
                                                                : 'Đang chờ'}
                                                        </Badge>
                                                    )}
                                                    {service.testResult && (
                                                        <div className="mt-3 p-3 bg-gray-50 rounded">
                                                            <Label className="text-xs text-slate-600 font-medium">
                                                                Kết quả:
                                                            </Label>
                                                            <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                                                                {service.testResult.result}
                                                            </p>
                                                            <p className="text-xs text-slate-600 mt-1">
                                                                Ngày:{' '}
                                                                {dayjs(
                                                                    service.testResult.resultDate
                                                                ).format('DD/MM/YYYY HH:mm')}{' '}
                                                                - Người thực hiện:{' '}
                                                                {service.testResult.createdBy}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                {!isLabServicesSaved && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemoveLabService(
                                                                service.serviceId
                                                            )
                                                        }
                                                        className="text-red-600 hover:bg-red-50 hover:border-red-200"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        {!isLabServicesSaved && (
                                            <Button
                                                onClick={handleSaveLabServices}
                                                className="gap-2 mt-4 w-full bg-purple-600 hover:bg-purple-700"
                                                disabled={appointmentService.length === 0}
                                            >
                                                <Save className="h-4 w-4" />
                                                Lưu chỉ định xét nghiệm
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                                            <TestTube className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 text-lg">
                                            Chưa chỉ định xét nghiệm nào
                                        </p>
                                        <p className="text-slate-400 text-sm mt-1">
                                            Nhấn "Thêm xét nghiệm" để bắt đầu
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        <Activity className="h-5 w-5 text-slate-600" />
                                    </div>
                                    Lịch sử kết quả xét nghiệm
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {appointmentService?.map(service => (
                                        <div
                                            key={service.appointmentServiceId}
                                            className="p-4 border border-slate-200 rounded-lg bg-gradient-to-r from-slate-50 to-gray-50"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900">
                                                        {service.serviceName}
                                                    </p>
                                                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                                                        <User className="h-3 w-3" />
                                                        Người XN:{' '}
                                                        {service.testResult?.createdBy ||
                                                            'Chưa thực hiện'}
                                                        <Calendar className="h-3 w-3 ml-2" />
                                                        {service.testResult
                                                            ? dayjs(
                                                                  service.testResult.resultDate
                                                              ).format('DD/MM/YYYY')
                                                            : 'Chưa có'}
                                                    </p>
                                                </div>
                                                <Badge
                                                    className={`${
                                                        service.status === 'Completed'
                                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                            : 'bg-orange-100 text-orange-800 border-orange-200'
                                                    }`}
                                                >
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    {service.status === 'Completed'
                                                        ? 'Đã có kết quả'
                                                        : 'Đang chờ'}
                                                </Badge>
                                            </div>
                                            {service.testResult && (
                                                <div className="bg-white p-3 rounded-lg border border-slate-200">
                                                    <Label className="text-xs text-slate-600 font-medium">
                                                        Kết quả:
                                                    </Label>
                                                    <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                                                        {service.testResult.result}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Diagnosis Tab */}
                <TabsContent value="diagnosis">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <FileText className="h-5 w-5 text-orange-600" />
                                    </div>
                                    Kết luận cuối cùng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <Form
                                    form={diagnosisForm}
                                    layout="vertical"
                                    onFinish={handleSaveDiagnosis}
                                    initialValues={{
                                        diagnosisNotes: appointmentInfo.generalConclusion || '',
                                    }}
                                >
                                    <Form.Item
                                        label="Kết luận cuối cùng"
                                        name="diagnosisNotes"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập kết luận cuối cùng!',
                                            },
                                        ]}
                                    >
                                        <TextArea
                                            rows={8}
                                            placeholder="Nhập kết luận cuối cùng và hướng điều trị..."
                                            disabled={isDiagnosisSaved}
                                            className="resize-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </Form.Item>
                                </Form>
                                <div className="flex gap-3">
                                    {!isDiagnosisSaved ? (
                                        <Button
                                            onClick={() => diagnosisForm.submit()}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            <Save className="h-4 w-4" />
                                            Lưu kết luận
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setIsDiagnosisSaved(false)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Chỉnh sửa
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {appointmentInfo.generalConclusion && (
                            <Card className="shadow-sm border-emerald-200 bg-emerald-50/30">
                                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
                                    <CardTitle className="flex items-center gap-3 text-emerald-800">
                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        Kết luận đã lưu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                            <Label className="text-emerald-800 font-semibold text-sm">
                                                Kết luận cuối cùng:
                                            </Label>
                                            <p className="text-emerald-700 mt-2 whitespace-pre-wrap leading-relaxed">
                                                {appointmentInfo.generalConclusion}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-emerald-700">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>Đã lưu kết luận cuối cùng</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Prescription Tab */}
                <TabsContent value="prescription">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Pill className="h-5 w-5 text-green-600" />
                                        </div>
                                        Đơn thuốc
                                    </CardTitle>
                                    {!prescriptionData.isSaved ? (
                                        <Button
                                            onClick={() => setIsPrescriptionDialogOpen(true)}
                                            className="gap-2 bg-green-600 hover:bg-green-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Thêm thuốc
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                setPrescriptionData({
                                                    ...prescriptionData,
                                                    isSaved: false,
                                                })
                                            }
                                            variant="outline"
                                            className="gap-2"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Chỉnh sửa
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {prescriptionData.medications.length > 0 ? (
                                    <div className="space-y-4">
                                        {prescriptionData.medications.map(medication => (
                                            <div
                                                key={medication.medicineId}
                                                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 space-y-2">
                                                        <p className="font-semibold text-slate-900 text-lg">
                                                            {medication.medicineName}
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-slate-600">
                                                                    Số lượng:
                                                                </span>
                                                                <span className="ml-2 font-medium">
                                                                    {medication.quantity}{' '}
                                                                    {medication.unit}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-600">
                                                                    Cách dùng:
                                                                </span>
                                                                <span className="ml-2 font-medium">
                                                                    {medication.dosageInstructions}
                                                                </span>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="text-slate-600">
                                                                    Thành tiền:
                                                                </span>
                                                                <span className="ml-2 font-bold text-emerald-600">
                                                                    {formatCurrency(
                                                                        medication.price *
                                                                            medication.quantity
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {!prescriptionData.isSaved && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleRemoveMedication(
                                                                    medication.medicineId
                                                                )
                                                            }
                                                            className="text-red-600 hover:bg-red-50 hover:border-red-200"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {!prescriptionData.isSaved && (
                                            <Form
                                                form={prescriptionForm}
                                                onFinish={handleSavePrescription}
                                            >
                                                <Button
                                                    onClick={() => prescriptionForm.submit()}
                                                    className="gap-2 mt-4 w-full bg-green-600 hover:bg-green-700"
                                                    disabled={
                                                        prescriptionData.medications.length === 0
                                                    }
                                                >
                                                    <Save className="h-4 w-4" />
                                                    Lưu đơn thuốc
                                                </Button>
                                            </Form>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                                            <Pill className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 text-lg">
                                            Chưa kê toa thuốc nào
                                        </p>
                                        <p className="text-slate-400 text-sm mt-1">
                                            Nhấn "Thêm thuốc" để bắt đầu
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    Hướng dẫn sử dụng thuốc
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <Form
                                    form={prescriptionForm}
                                    layout="vertical"
                                    initialValues={{
                                        instructions: prescriptionData.instructions,
                                    }}
                                >
                                    <Form.Item label="Hướng dẫn sử dụng thuốc" name="instructions">
                                        <TextArea
                                            rows={6}
                                            placeholder="Hướng dẫn cách sử dụng thuốc, lưu ý đặc biệt..."
                                            disabled={prescriptionData.isSaved}
                                            className="resize-none focus:ring-2 focus:ring-blue-500"
                                            onChange={e =>
                                                setPrescriptionData({
                                                    ...prescriptionData,
                                                    instructions: e.target.value,
                                                })
                                            }
                                        />
                                    </Form.Item>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Payment Tab */}
                <TabsContent value="payment">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Receipt className="h-5 w-5 text-emerald-600" />
                                </div>
                                Tổng kết và thanh toán
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                                        <Receipt className="h-5 w-5" />
                                        Chi tiết chi phí
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                            <span className="text-slate-700">Phí khám bệnh</span>
                                            <span className="font-semibold text-lg">
                                                {formatCurrency(paymentData.examinationFee)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                            <span className="text-slate-700">
                                                Phí xét nghiệm ({selectedLabServices.length} dịch
                                                vụ)
                                            </span>
                                            <span className="font-semibold text-lg">
                                                {formatCurrency(paymentData.labFees)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                            <span className="text-slate-700">
                                                Tiền thuốc ({prescriptionData.medications.length}{' '}
                                                loại)
                                            </span>
                                            <span className="font-semibold text-lg">
                                                {formatCurrency(paymentData.medicationFees)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 border-t-2 border-emerald-200 bg-emerald-50 rounded-lg px-4">
                                            <span className="text-xl font-bold text-slate-900">
                                                Tổng cộng
                                            </span>
                                            <span className="text-2xl font-bold text-emerald-600">
                                                {formatCurrency(paymentData.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Tóm tắt điều trị
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <span className="font-semibold text-slate-700 block mb-2">
                                                Kết luận cuối cùng:
                                            </span>
                                            <p className="text-slate-800 leading-relaxed">
                                                {diagnosisForm.getFieldValue('diagnosisNotes') ||
                                                    'Chưa có kết luận cuối cùng'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <span className="font-semibold text-slate-700 block mb-2">
                                                Xét nghiệm đã chỉ định:
                                            </span>
                                            <p className="text-slate-800">
                                                {selectedLabServices.length > 0
                                                    ? selectedLabServices
                                                          .map(s => s.serviceName)
                                                          .join(', ')
                                                    : 'Không có'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <span className="font-semibold text-slate-700 block mb-2">
                                                Thuốc đã kê:
                                            </span>
                                            <p className="text-slate-800">
                                                {prescriptionData.medications.length > 0
                                                    ? prescriptionData.medications
                                                          .map(m => m.medicineName)
                                                          .join(', ')
                                                    : 'Không có'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-slate-200">
                                <Button
                                    onClick={handleCompleteTreatment}
                                    className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-lg py-3"
                                >
                                    <CheckCircle className="h-5 w-5" />
                                    Hoàn thành khám bệnh
                                </Button>
                                <Button variant="outline" className="gap-2 px-6">
                                    <Printer className="h-4 w-4" />
                                    In toa thuốc
                                </Button>
                                <Button variant="outline" className="gap-2 px-6">
                                    <Send className="h-4 w-4" />
                                    Gửi kết quả
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Lab Service Selection Dialog */}
            <Dialog open={isLabServiceDialogOpen} onOpenChange={setIsLabServiceDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <TestTube className="h-5 w-5" />
                            Chỉ định xét nghiệm
                        </DialogTitle>
                        <DialogDescription>
                            Chọn các dịch vụ xét nghiệm cần thiết cho bệnh nhân
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {availableLabServices.map(service => (
                            <div
                                key={service.id}
                                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <Checkbox
                                        checked={selectedLabServices.some(
                                            s => s.serviceId === service.id
                                        )}
                                        onCheckedChange={checked => {
                                            if (checked) {
                                                handleAddLabService(service);
                                            } else {
                                                handleRemoveLabService(service.id);
                                            }
                                        }}
                                        className="data-[state=checked]:bg-purple-600"
                                    />
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {service.name}
                                        </p>
                                        <Badge variant="secondary" className="text-xs mt-1">
                                            {service.category}
                                        </Badge>
                                    </div>
                                </div>
                                <span className="font-bold text-emerald-600 text-lg">
                                    {formatCurrency(service.price)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsLabServiceDialogOpen(false)}
                            className="px-6"
                        >
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Medication Selection Dialog */}
            <Dialog open={isPrescriptionDialogOpen} onOpenChange={setIsPrescriptionDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <Pill className="h-5 w-5" />
                            Kê toa thuốc
                        </DialogTitle>
                        <DialogDescription>Chọn thuốc cần kê cho bệnh nhân</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {availableMedications.map(medication => (
                            <div
                                key={medication.id}
                                className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-slate-900 text-lg">
                                            {medication.name}
                                        </p>
                                        <p className="text-slate-600 mt-1">
                                            Giá: {formatCurrency(medication.price)}/viên
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            {medication.dosages.map(dosage => (
                                                <Badge
                                                    key={dosage}
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {dosage}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            handleAddMedication({
                                                ...medication,
                                                dosage: medication.dosages[0],
                                            })
                                        }
                                        className="gap-2 bg-green-600 hover:bg-green-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Thêm
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsPrescriptionDialogOpen(false)}
                            className="px-6"
                        >
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AppointmentDetail;
