import React, { memo } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useSelector } from 'react-redux';

const SpecialtySelection = ({ selectedSpecialty, onSpecialtySelect }) => {
    const { specialties } = useSelector(state => state.SpecialtyReducer);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-3">
            <div className="border-b border-gray-200 px-1 py-4 mb-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Chọn chuyên khoa</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        Bước 2/6
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {specialties.map(specialty => (
                    <Card
                        key={specialty.specialtyId}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedSpecialty?.specialtyId === specialty.specialtyId
                                ? 'ring-2 ring-emerald-600 bg-emerald-50'
                                : 'hover:bg-gray-50'
                        }`}
                        onClick={() => onSpecialtySelect(specialty)}
                    >
                        <CardContent className="p-4 text-center">
                            <h3 className="font-semibold text-sm mb-2">{specialty.name}</h3>
                            <p className="text-xs text-gray-600 line-clamp-2">
                                {specialty.description}
                            </p>
                            {selectedSpecialty?.specialtyId === specialty.specialtyId && (
                                <Badge className="mt-2 bg-emerald-600 text-xs py-0">
                                    <Check className="h-3 w-3 mr-1" />
                                    Đã chọn
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default memo(SpecialtySelection);
