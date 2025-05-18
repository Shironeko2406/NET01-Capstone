using ClinictManagementSystem.Interfaces;

namespace ClinictManagementSystem.Services
{
    public class ClaimsService : IClaimsService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ClaimsService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public string GetCurrentUserEmail()
        {
            throw new NotImplementedException();
        }

        public Guid GetCurrentUserId()
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst("UserId")?.Value;
            return string.IsNullOrEmpty(userId) ? Guid.Empty : Guid.Parse(userId);
        }

        public string GetCurrentUserName()
        {
            throw new NotImplementedException();
        }
    }
}
