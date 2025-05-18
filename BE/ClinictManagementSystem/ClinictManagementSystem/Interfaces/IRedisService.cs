namespace ClinictManagementSystem.Interfaces
{
    public interface IRedisService
    {
        Task<bool> StoreJwtTokenAsync(string userName, string jwtToken);
        Task<bool> CheckUserExistAsync(string userName);
        Task RemoveUserIfExistsAsync(string userName);
        Task<bool> CheckJwtTokenExistsAsync(string userName);
    }
}
