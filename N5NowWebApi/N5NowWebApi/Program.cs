using DataAccessEF;
using DataAccessEF.UnitOfWork;
using DataAccessEF.TypeRepository;
using Domain.Interfaces;
using MediatR;
using System.Reflection;
//using static System.Reflection.Metadata.BlobBuilder;
using N5NowWebApi.Extensions;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddMediatR(Assembly.GetExecutingAssembly());
builder.Services.AddDbContext<N5nowDbContext>();
//builder.Services.AddScoped<IPermissionTypeRepository, PermissionTypeRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddElasticsearch(builder.Configuration);

builder.Services.AddSingleton<IKafkaProducerWrapper>(sp =>
{
    return new KafkaProducerWrapper(builder.Configuration);
});

builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder
                    .AllowAnyOrigin() // Permite cualquier origen
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors();

app.Run();
