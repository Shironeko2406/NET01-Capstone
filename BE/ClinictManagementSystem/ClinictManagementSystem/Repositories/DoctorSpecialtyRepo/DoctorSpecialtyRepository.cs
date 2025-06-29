using ClinictManagementSystem.Models.Entity;

namespace ClinictManagementSystem.Repositories.DoctorSpecialtyRepo
{
    public class DoctorSpecialtyRepository : IDoctorSpecialtyRepository
    {
        private readonly AppDbContext _context;
        public DoctorSpecialtyRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddDoctorSpecialtyAsync(DoctorSpecialties doctorSpecialty)
        {
            await _context.DoctorSpecialties.AddAsync(doctorSpecialty);
        }
        public async Task AddRangeAsync(List<DoctorSpecialties> entities)
        {
            await _context.DoctorSpecialties.AddRangeAsync(entities);
        }

        public void HardRemoveRange(List<DoctorSpecialties> entities)
        {
            _context.DoctorSpecialties.RemoveRange(entities);
        }
    }
}
