import { Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAppointmentDetailByIdActionAsync } from '../../Redux/ReducerAPI/AppointmentReducer';
import useQueryParam from '../../Hooks/UseQueryParam';
import AppointmentOverview from '../Components/AppointmentOverview';
import AppointmentInfoDetailCard from '../Components/AppointmentInfoDetailCard';
import AppointmentStepTabs from '../Components/AppointmentStepTabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ExaminationTab from '../Components/ExaminationTab';
import LabServiceList from '../Components/LabServiceList';
import LabServiceHistory from '../Components/LabServiceHistory';
import DiagnosisTab from '../Components/DiagnosisTab';
import PrescriptionTab from '../Components/PrescriptionTab';
import PaymentSummaryTab from '../Components/PaymentSummaryTab';
import { GetPaymentUrlInvoiceActionAsync } from '../../Redux/ReducerAPI/InvoiceReducer';
import { useGlobalLoading } from '../../Context/LoadingContext';

const AppoitnmentDetail = () => {
    // ==================== REDUX & HOOKS ====================
    const { appointmentInfo } = useSelector(state => state.AppointmentReducer);
    const appointmentId = useQueryParam('id');
    const { showLoading, hideLoading } = useGlobalLoading();
    const dispatch = useDispatch();

    // ==================== FORM INSTANCES ====================
    const [examinationForm] = Form.useForm();
    const [diagnosisForm] = Form.useForm();
    const [prescriptionForm] = Form.useForm();

    // ==================== CORE STATE ====================
    const [activeTab, setActiveTab] = useState('examination');

    useEffect(() => {
        dispatch(GetAppointmentDetailByIdActionAsync(appointmentId));
    }, [appointmentId]);

    // ==================== PAYMENT & COMPLETION HANDLERS ====================

    const handlePayment = async () => {
        showLoading();
        await dispatch(GetPaymentUrlInvoiceActionAsync(appointmentInfo.invoiceId));
        hideLoading();
    };
    return (
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 space-y-6">
            <AppointmentOverview />

            <AppointmentInfoDetailCard />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <AppointmentStepTabs />

                {/* Examination Tab */}
                <TabsContent value="examination">
                    <ExaminationTab examinationForm={examinationForm} />
                </TabsContent>

                {/* Lab Services Tab */}
                <TabsContent value="lab-services">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <LabServiceList />
                        <LabServiceHistory />
                    </div>
                </TabsContent>

                <TabsContent value="diagnosis">
                    <DiagnosisTab diagnosisForm={diagnosisForm} />
                </TabsContent>

                <TabsContent value="prescription">
                    <PrescriptionTab prescriptionForm={prescriptionForm} />
                </TabsContent>

                <TabsContent value="payment">
                    <PaymentSummaryTab handlePayment={handlePayment} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AppoitnmentDetail;
