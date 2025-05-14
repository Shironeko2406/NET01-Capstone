using AutoMapper;
using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.ServiceDTO;
using ClinictManagementSystem.Models.Entity;

namespace ClinictManagementSystem.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            #region Service
            CreateMap<Pagination<Service>, Pagination<GetServiceDTO>>();
            #endregion

        }
    }
}
