import { Input, InputNumber } from 'antd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Pill, Plus, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
    getMedicineStatusColor,
    getMedicineStatusTranslate,
    getMedicineUnitTranslate,
} from '../../Utils/Translate&FormatColor/MedicineUtil';
import { formatCurrencyVN } from '../../Utils/Format/FormatCurrency';

const PrescriptionModal = ({
    isOpen,
    onOpenChange,
    searchMedicine,
    setSearchMedicine,
    medicineQuantities,
    setMedicineQuantities,
    handleAddMedication,
    handleDosageInstructionsChange,
    handleDosageInstructionsBlur,
}) => {
    const { prescription } = useSelector(state => state.AppointmentReducer);
    const { medicines } = useSelector(state => state.MedicineReducer);

    const filteredMedicines = medicines.filter(
        medication =>
            medication.name.toLowerCase().includes(searchMedicine.toLowerCase()) ||
            medication.medicineCode.toLowerCase().includes(searchMedicine.toLowerCase()) ||
            medication.medicineTypeName.toLowerCase().includes(searchMedicine.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] w-full sm:max-w-2xl md:max-w-4xl lg:max-w-7xl flex flex-col">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Kê toa thuốc
                    </DialogTitle>
                    <DialogDescription>
                        Chọn thuốc và nhập số lượng cần kê cho bệnh nhân
                    </DialogDescription>

                    {/* Search Section */}
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm thuốc theo tên, mã thuốc..."
                            value={searchMedicine}
                            onChange={e => setSearchMedicine(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                        {filteredMedicines.map(medication => {
                            const existingMedicine = prescription?.prescriptionDetails.find(
                                m => m.medicineId === medication.medicineId
                            );
                            const isSelected = !!existingMedicine;
                            const existingDosage = existingMedicine?.dosageInstructions || '';

                            return (
                                <div
                                    key={medication.medicineId}
                                    className={`p-3 sm:p-4 border rounded-lg transition-colors ${
                                        medication.status === 'OutOfStock'
                                            ? 'border-red-200 bg-red-50 opacity-60'
                                            : isSelected
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <p className="font-semibold text-slate-900 text-base sm:text-lg truncate">
                                                    {medication.name}
                                                </p>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs flex-shrink-0"
                                                >
                                                    {medication.medicineCode}
                                                </Badge>
                                                <Badge
                                                    className={`text-xs ${getMedicineStatusColor(
                                                        medication.status
                                                    )}`}
                                                    variant="secondary"
                                                >
                                                    {getMedicineStatusTranslate(medication.status)}
                                                </Badge>
                                                {isSelected && (
                                                    <Badge className="text-xs bg-green-600 text-white flex-shrink-0">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Đã chọn
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm mb-3">
                                                <div className="truncate">
                                                    <span className="text-slate-600">
                                                        Loại thuốc:
                                                    </span>
                                                    <span className="ml-2 font-medium">
                                                        {medication.medicineTypeName}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600">Đơn vị:</span>
                                                    <span className="ml-2 font-medium">
                                                        {getMedicineUnitTranslate(medication.unit)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600">Giá:</span>
                                                    <span className="ml-2 font-bold text-emerald-600">
                                                        {formatCurrencyVN(medication.price)}/
                                                        {getMedicineUnitTranslate(medication.unit)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-600">Tồn kho:</span>
                                                    <span
                                                        className={`ml-2 font-medium flex items-center gap-1 ${
                                                            medication.stockQuantity <=
                                                            medication.minQuantity
                                                                ? 'text-red-600'
                                                                : 'text-slate-800'
                                                        }`}
                                                    >
                                                        {medication.stockQuantity <=
                                                            medication.minQuantity && (
                                                            <AlertCircle className="h-3 w-3" />
                                                        )}
                                                        {medication.stockQuantity}{' '}
                                                        {getMedicineUnitTranslate(medication.unit)}
                                                    </span>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="p-3 bg-green-100 border border-green-200 rounded-lg mb-3">
                                                    <div className="flex items-center gap-2 text-green-700 text-sm mb-1">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span className="font-medium">
                                                            Đã có trong đơn thuốc:
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-green-800 flex flex-col sm:flex-row sm:gap-4">
                                                        <span>
                                                            Số lượng: {existingMedicine.quantity}{' '}
                                                            {getMedicineUnitTranslate(
                                                                medication.unit
                                                            )}
                                                        </span>
                                                        <span>
                                                            Cách dùng:{' '}
                                                            {existingMedicine.dosageInstructions}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {medication.status === 'OutOfStock' && (
                                                <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span>Thuốc này hiện đã hết hàng</span>
                                                </div>
                                            )}

                                            {medication.stockQuantity <= medication.minQuantity &&
                                                medication.status !== 'OutOfStock' && (
                                                    <div className="flex items-center gap-2 text-yellow-600 text-sm mb-2">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <span className="text-xs sm:text-sm">
                                                            Thuốc sắp hết hàng (dưới mức tối thiểu:{' '}
                                                            {medication.minQuantity})
                                                        </span>
                                                    </div>
                                                )}
                                        </div>

                                        {medication.status !== 'OutOfStock' && (
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:ml-4 min-w-0 lg:min-w-fit">
                                                <div className="flex flex-col items-center gap-2 min-w-0">
                                                    <Label className="text-sm font-medium whitespace-nowrap">
                                                        Số lượng
                                                    </Label>
                                                    <InputNumber
                                                        min={1}
                                                        max={medication.stockQuantity}
                                                        value={
                                                            medicineQuantities[
                                                                medication.medicineId
                                                            ] || 1
                                                        }
                                                        onChange={value =>
                                                            setMedicineQuantities(prev => ({
                                                                ...prev,
                                                                [medication.medicineId]: value || 1,
                                                            }))
                                                        }
                                                        className="w-full sm:w-20"
                                                        size="small"
                                                    />
                                                </div>
                                                <div className="flex flex-col items-center gap-2 min-w-0 flex-1 sm:flex-initial">
                                                    <Label className="text-sm font-medium whitespace-nowrap">
                                                        Cách dùng
                                                    </Label>
                                                    <Input
                                                        placeholder="VD: 1 lần/ngày"
                                                        defaultValue={
                                                            existingDosage || '1 lần/ngày'
                                                        }
                                                        onChange={e =>
                                                            handleDosageInstructionsChange(
                                                                medication.medicineId,
                                                                e.target.value
                                                            )
                                                        }
                                                        onBlur={e =>
                                                            handleDosageInstructionsBlur(
                                                                medication.medicineId,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full sm:w-32 text-sm"
                                                        size="small"
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-end">
                                                    <Button
                                                        onClick={() =>
                                                            handleAddMedication(
                                                                medication,
                                                                medicineQuantities[
                                                                    medication.medicineId
                                                                ] || 1
                                                            )
                                                        }
                                                        className="gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto whitespace-nowrap"
                                                        size="sm"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        {isSelected ? 'Thêm nữa' : 'Thêm'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {filteredMedicines.length === 0 && (
                            <div className="text-center py-12">
                                <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                                    <Pill className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-slate-500 text-lg">
                                    {searchMedicine
                                        ? `Không tìm thấy thuốc "${searchMedicine}"`
                                        : 'Không có thuốc nào'}
                                </p>
                                <p className="text-slate-400 text-sm mt-1">
                                    {searchMedicine
                                        ? 'Thử tìm kiếm với từ khóa khác'
                                        : 'Danh sách thuốc trống'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-auto p-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-center">
                    <div className="flex items-center text-sm text-slate-600 mb-2 sm:mb-0 sm:mr-auto">
                        <span>Tổng: {filteredMedicines.length} thuốc</span>
                        {prescription?.prescriptionDetails.length > 0 && (
                            <span className="ml-4 text-green-600 font-medium">
                                Đã chọn: {prescription.prescriptionDetails.length} thuốc
                            </span>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false);
                            setSearchMedicine('');
                        }}
                        className="w-full sm:w-auto px-6"
                    >
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PrescriptionModal;
