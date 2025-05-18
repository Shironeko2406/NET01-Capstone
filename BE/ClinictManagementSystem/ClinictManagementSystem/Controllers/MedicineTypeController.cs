using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.MedicineTypeDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/medicineType")]
    [ApiController]
    public class MedicineTypeController : ControllerBase
    {
        private readonly IMedicineTypeService _medicineTypeService;

        public MedicineTypeController(IMedicineTypeService medicineTypeService)
        {
            _medicineTypeService = medicineTypeService;
        }

        [HttpPost]
        public async Task<ApiResponse<bool>> CreateMedicineType(CreateMedicineTypeDTO createMedicineTypeDTO)
        {
            return await _medicineTypeService.CreateMedicineTypeAsync(createMedicineTypeDTO);
        }

        [HttpDelete("{id}")]
        public async Task<ApiResponse<bool>> DeleteMedicineType(Guid id)
        {
            return await _medicineTypeService.DeleteMedicineTypeByIdAsync(id);
        }

        [HttpPut("{id}")]
        public async Task<ApiResponse<bool>> UpdateMedicineType(Guid id, UpdateMedicineTypeDTO updateMedicineTypeDTO)
        {
            return await _medicineTypeService.UpdateMedicineTypeByIdAsync(id, updateMedicineTypeDTO);
        }

        [Authorize(Roles = AppRole.Admin + "," + AppRole.Doctor)]
        [HttpGet]
        public async Task<ApiResponse<List<MedicineTypeGetDTO>>> GetAllMedicineTypes()
        {
            return await _medicineTypeService.GetAllMedicineTypesAsync();
        }

    }
}
