using ClinictManagementSystem;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Mapper;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.AppoinmentRepo;
using ClinictManagementSystem.Repositories.AppointmentServicesRepo;
using ClinictManagementSystem.Repositories.DoctorScheduleRepo;
using ClinictManagementSystem.Repositories.DoctorSpecialtyRepo;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.MedicineRepo;
using ClinictManagementSystem.Repositories.MedicineStockHistoryRepo;
using ClinictManagementSystem.Repositories.MedicineTypeRepo;
using ClinictManagementSystem.Repositories.PrescriptionDetailsRepo;
using ClinictManagementSystem.Repositories.PrescriptionRepo;
using ClinictManagementSystem.Repositories.RoleRepo;
using ClinictManagementSystem.Repositories.ServiceRepo;
using ClinictManagementSystem.Repositories.SpecialtyRepo;
using ClinictManagementSystem.Repositories.TestResultRepo;
using ClinictManagementSystem.Repositories.UnitOfWork;
using ClinictManagementSystem.Repositories.UsersRepo;
using ClinictManagementSystem.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ClinictConnect")));

// ===== Add Redis =====
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.EnableAnnotations();
    // Thêm cấu hình bảo mật (Security Definition)
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid JWT token.\nExample: Bearer eyJhbGciOiJIUzI1NiIsInR..."
    });

    // Thêm yêu cầu bảo mật (Security Requirement)
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {} // No specific scopes
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder
            .AllowAnyOrigin()      // hoặc .WithOrigins("http://localhost:3000") nếu muốn cụ thể
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});


//Đăng ký DI
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<ISpecialtyRepository, SpecialtyRepository>();
builder.Services.AddScoped<IDoctorSpecialtyRepository, DoctorSpecialtyRepository>();
builder.Services.AddScoped<IDoctorScheduleRepository, DoctorScheduleRepository>();
builder.Services.AddScoped<IMedicineTypeRepository, MedicineTypeRepository>();
builder.Services.AddScoped<IMedicineRepository, MedicineRepository>();
builder.Services.AddScoped<IMedicineStockHistoryRepository, MedicineStockHistoryRepository>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IAppoinmentRepository, AppoinmentRepository>();
builder.Services.AddScoped<IAppointmentServicesRepository, AppointmentServicesRepository>();
builder.Services.AddScoped<ITestResultRepository, TestResultRepository>();
builder.Services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();
builder.Services.AddScoped<IPrescriptionDetailsRepository, PrescriptionDetailsRepository>();




//Đăng ký service
builder.Services.AddScoped<IServiceClinict, ServiceClinict>();
builder.Services.AddScoped<ISpecialtyService, SpecialtyService>();
builder.Services.AddScoped<IMedicineTypeService, MedicineTypeService>();
builder.Services.AddScoped<IMedicineService, MedicineService>();
builder.Services.AddScoped<IMedicineStockHistoryService, MedicineStockHistoryService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IDoctorScheduleService, DoctorScheduleService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IAppointmentServiceDetailService, AppointmentServiceDetailService>();
builder.Services.AddScoped<IAppointmentServiceDetailService, AppointmentServiceDetailService>();
builder.Services.AddScoped<ITestResultService, TestResultService>();
builder.Services.AddScoped<IPrescriptionService, PrescriptionService>();
builder.Services.AddScoped<IJWTService, JWTService>();
builder.Services.AddScoped<ICurrentTime, CurrentTime>();
builder.Services.AddScoped<IRedisService, RedisService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IClaimsService, ClaimsService>();


builder.Services.AddHttpContextAccessor();
builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
