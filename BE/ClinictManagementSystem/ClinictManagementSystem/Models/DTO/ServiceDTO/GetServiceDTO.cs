namespace ClinictManagementSystem.Models.DTO.ServiceDTO
{
    public class GetServiceDTO
    {
        public Guid ServiceId { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
    }
}
