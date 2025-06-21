export const calculateLabTestProgress = services => {
    if (!services || services.length === 0) {
        return { percentage: 0, completed: 0, total: 0 };
    }

    const validServices = services.filter(service => service.testResult !== null);

    const completed = validServices.filter(
        service => service.testResult.result !== null && service.status === 'Completed'
    ).length;

    const total = validServices.length;

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { percentage, completed, total };
};
