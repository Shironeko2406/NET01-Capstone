import { ArrowDown, ArrowUp, Settings2 } from 'lucide-react';

const getStockHistoryTypeTranslate = type => {
    const labels = {
        Import: 'Nhập kho',
        Export: 'Xuất kho',
        Adjust: 'Điều chỉnh kho',
    };
    return labels[type] || 'Không xác định';
};

const getStockHistoryColor = type => {
    const colors = {
        Import: 'bg-green-100 text-green-800',
        Export: 'bg-red-100 text-red-800',
        Adjust: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
};

const getStockHistoryIcon = type => {
    const size = 14;
    const icons = {
        Import: <ArrowUp size={size} className="mr-1" />,
        Export: <ArrowDown size={size} className="mr-1" />,
        Adjust: <Settings2 size={size} className="mr-1" />,
    };
    return icons[type] || <HelpCircle size={size} className="mr-1" />;
};

export { getStockHistoryTypeTranslate, getStockHistoryColor, getStockHistoryIcon };
