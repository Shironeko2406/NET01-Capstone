import { useState, useRef, useCallback } from 'react';
import { Form, message } from 'antd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { FileText, Receipt, CheckCircle, Printer, Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentOverview from '../Components/AppointmentOverview';
import AppointmentInfoDetailCard from '../Components/AppointmentInfoDetailCard';
import AppointmentStepTabs from '../Components/AppointmentStepTabs';
import ExaminationTab from '../Components/ExaminationTab';
import { setAppointmentServices, setPrescription } from '../../Redux/ReducerAPI/AppointmentReducer';
import LabServiceList from '../Components/LabServiceList';
import LabServiceHistory from '../Components/LabServiceHistory';
import AddLabServiceModal from '../Modal/AddLabServiceModal';
import DiagnosisTab from '../Components/DiagnosisTab';
import PrescriptionTab from '../Components/PrescriptionTab';
import AddPrescriptionModal from '../Modal/AddPrescriptionModal';

const AppointmentDetail2 = () => {
    const { appointmentInfo, appointmentService, prescription } = useSelector(
        state => state.AppointmentReducer
    );
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('examination');

    // Ant Design Form instances
    const [examinationForm] = Form.useForm();
    const [diagnosisForm] = Form.useForm();
    const [prescriptionForm] = Form.useForm();

    // State management
    const [isLabServiceDialogOpen, setIsLabServiceDialogOpen] = useState(false);
    const [selectedServicesInDialog, setSelectedServicesInDialog] = useState([]);
    const serviceNotesRef = useRef({});
    const dosageInstructionsRef = useRef({});
    const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
    const [medicineQuantities, setMedicineQuantities] = useState({});
    const [searchMedicine, setSearchMedicine] = useState('');

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
    const [isPrescriptionSaved, setIsPrescriptionSaved] = useState(Boolean(prescription));

    const handleOpenLabServiceDialog = () => {
        setSelectedServicesInDialog([...appointmentService]);
        setIsLabServiceDialogOpen(true);
    };

    const handleSaveSelectedServices = () => {
        dispatch(setAppointmentServices(selectedServicesInDialog));
        updatePayment(selectedServicesInDialog, prescription.prescriptionDetails);
        setIsLabServiceDialogOpen(false);
        message.success('Đã lưu chỉ định xét nghiệm!');
    };

    const handleServiceSelectionChange = (service, checked) => {
        if (checked) {
            const newService = {
                appointmentServiceId: Date.now().toString(),
                serviceId: service.serviceId,
                serviceName: service.name,
                serviceDescription: service.description,
                status: 'Pending',
                price: service.price,
                note: serviceNotesRef.current[service.serviceId] || '',
                testResult: null,
            };
            setSelectedServicesInDialog(prev => [...prev, newService]);
        } else {
            const isOriginalService = appointmentService.some(
                s => s.serviceId === service.serviceId
            );
            if (!isOriginalService) {
                setSelectedServicesInDialog(prev =>
                    prev.filter(s => s.serviceId !== service.serviceId)
                );
                // Remove note when unchecking
                delete serviceNotesRef.current[service.serviceId];
            }
        }
    };

    const handleNoteBlur = useCallback((serviceId, value) => {
        serviceNotesRef.current[serviceId] = value;
        setSelectedServicesInDialog(prev =>
            prev.map(service =>
                service.serviceId === serviceId ? { ...service, note: value } : service
            )
        );
    }, []);

    const handleNoteChange = useCallback((serviceId, value) => {
        serviceNotesRef.current[serviceId] = value;
    }, []);

    const handleRemoveLabService = serviceId => {
        const newServices = appointmentService.filter(s => s.serviceId !== serviceId);
        dispatch(setAppointmentServices(newServices));
        updatePayment(newServices, prescription.prescriptionDetails);
    };

    const handleAddMedication = (medication, quantity) => {
        if (quantity <= 0) {
            message.error('Số lượng phải lớn hơn 0');
            return;
        }

        if (medication.status === 'OutOfStock') {
            message.error('Thuốc này hiện đã hết hàng');
            return;
        }

        if (quantity > medication.stockQuantity) {
            message.error(
                `Số lượng vượt quá tồn kho (${medication.stockQuantity} ${medication.unit})`
            );
            return;
        }

        const currentPrescription = prescription; // from Redux
        const existingIndex = currentPrescription.prescriptionDetails.findIndex(
            m => m.medicineId === medication.medicineId
        );

        let updatedPrescriptionDetails;

        if (existingIndex !== -1) {
            // Cộng thêm số lượng thuốc đã có
            updatedPrescriptionDetails = [...currentPrescription.prescriptionDetails];
            updatedPrescriptionDetails[existingIndex] = {
                ...updatedPrescriptionDetails[existingIndex],
                quantity: updatedPrescriptionDetails[existingIndex].quantity + quantity,
                dosageInstructions:
                    dosageInstructionsRef.current[medication.medicineId] ||
                    updatedPrescriptionDetails[existingIndex].dosageInstructions,
            };
            message.success(`Đã cộng thêm ${quantity} ${medication.unit} ${medication.name}`);
        } else {
            // Thêm thuốc mới
            const newMedication = {
                medicineId: medication.medicineId,
                medicineName: medication.name,
                quantity,
                dosageInstructions:
                    dosageInstructionsRef.current[medication.medicineId] || '1 lần/ngày',
                unit: medication.unit,
                price: medication.price,
            };
            updatedPrescriptionDetails = [
                ...currentPrescription.prescriptionDetails,
                newMedication,
            ];
            message.success(`Đã thêm ${quantity} ${medication.unit} ${medication.name}`);
        }

        // Dispatch cập nhật prescription mới
        dispatch(
            setPrescription({
                ...currentPrescription,
                prescriptionDetails: updatedPrescriptionDetails,
            })
        );

        updatePayment(appointmentService, updatedPrescriptionDetails);

        // Reset lại form input
        setMedicineQuantities(prev => ({
            ...prev,
            [medication.medicineId]: 1,
        }));
        delete dosageInstructionsRef.current[medication.medicineId];
    };

    const handleRemoveMedication = medicineId => {
        const updatedPrescriptionDetails = prescription.prescriptionDetails.filter(
            m => m.medicineId !== medicineId
        );

        dispatch(
            setPrescription({
                ...prescription,
                prescriptionDetails: updatedPrescriptionDetails,
            })
        );

        updatePayment(appointmentService, updatedPrescriptionDetails);

        message.success('Đã xoá thuốc khỏi đơn thuốc');
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

    const getStatusColor = status => {
        switch (status) {
            case 'InStock':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'LowStock':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'OutOfStock':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = status => {
        switch (status) {
            case 'InStock':
                return 'Còn hàng';
            case 'LowStock':
                return 'Sắp hết';
            case 'OutOfStock':
                return 'Hết hàng';
            default:
                return status;
        }
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

    const handleSavePrescription = values => {
        console.log('Prescription data:', values);
        setIsPrescriptionSaved(true);
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

    const handleDosageInstructionsChange = useCallback((medicineId, value) => {
        // Only save to ref, don't trigger re-render
        dosageInstructionsRef.current[medicineId] = value;
    }, []);

    const handleDosageInstructionsBlur = useCallback((medicineId, value) => {
        // Save to ref
        dosageInstructionsRef.current[medicineId] = value;
    }, []);

    return (
        <div className="mx-auto space-y-6">
            {/* Enhanced Header */}
            <AppointmentOverview />

            {/* Enhanced Patient Summary Card */}
            <AppointmentInfoDetailCard />

            {/* Enhanced Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <AppointmentStepTabs />

                {/* Examination Tab */}
                <TabsContent value="examination">
                    <ExaminationTab
                        examinationForm={examinationForm}
                        isExaminationSaved={isExaminationSaved}
                        setIsExaminationSaved={setIsExaminationSaved}
                        handleSaveExamination={handleSaveExamination}
                    />
                </TabsContent>

                {/* Lab Services Tab */}
                <TabsContent value="lab-services">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <LabServiceList
                            handleOpenLabServiceDialog={handleOpenLabServiceDialog}
                            handleRemoveLabService={handleRemoveLabService}
                        />
                        <LabServiceHistory />
                    </div>
                </TabsContent>

                {/* Other tabs remain the same... */}
                <TabsContent value="diagnosis">
                    <DiagnosisTab
                        diagnosisForm={diagnosisForm}
                        isDiagnosisSaved={isDiagnosisSaved}
                        setIsDiagnosisSaved={setIsDiagnosisSaved}
                        handleSaveDiagnosis={handleSaveDiagnosis}
                    />
                </TabsContent>

                <TabsContent value="prescription">
                    <PrescriptionTab
                        prescriptionForm={prescriptionForm}
                        isPrescriptionSaved={isPrescriptionSaved}
                        setIsPrescriptionSaved={setIsPrescriptionSaved}
                        setIsPrescriptionDialogOpen={setIsPrescriptionDialogOpen}
                        handleRemoveMedication={handleRemoveMedication}
                        handleSavePrescription={handleSavePrescription}
                    />
                </TabsContent>

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
                                                Phí xét nghiệm ({appointmentService.length} dịch vụ)
                                            </span>
                                            <span className="font-semibold text-lg">
                                                {formatCurrency(paymentData.labFees)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                            <span className="text-slate-700">
                                                Tiền thuốc (
                                                {prescription.prescriptionDetails.length} loại)
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
                                                {appointmentService.length > 0
                                                    ? appointmentService
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
                                                {prescription.prescriptionDetails.length > 0
                                                    ? prescription.prescriptionDetails
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
            <AddLabServiceModal
                open={isLabServiceDialogOpen}
                onOpenChange={setIsLabServiceDialogOpen}
                selectedServicesInDialog={selectedServicesInDialog}
                serviceNotesRef={serviceNotesRef}
                handleServiceSelectionChange={handleServiceSelectionChange}
                handleNoteChange={handleNoteChange}
                handleNoteBlur={handleNoteBlur}
                handleSaveSelectedServices={handleSaveSelectedServices}
            />

            {/* Enhanced Medication Selection Dialog */}
            <AddPrescriptionModal
                isOpen={isPrescriptionDialogOpen}
                onOpenChange={setIsPrescriptionDialogOpen}
                searchMedicine={searchMedicine}
                setSearchMedicine={setSearchMedicine}
                medicineQuantities={medicineQuantities}
                setMedicineQuantities={setMedicineQuantities}
                handleAddMedication={handleAddMedication}
                handleDosageInstructionsChange={handleDosageInstructionsChange}
                handleDosageInstructionsBlur={handleDosageInstructionsBlur}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
            />
        </div>
    );
};

export default AppointmentDetail2;
