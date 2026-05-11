using System;
using System.Collections.Generic;
using System.Fabric;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using Microsoft.ServiceFabric.Data;
using TripService.Data;
using TripService.Services;

namespace TripService
{
    internal sealed class TripService : StatefulService
    {
        public TripService(StatefulServiceContext context)
            : base(context)
        { }

        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            return new ServiceReplicaListener[]
            {
                new ServiceReplicaListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

                        var builder = WebApplication.CreateBuilder();
                        builder.Configuration.AddJsonFile("appsettings.json", optional: false);

                        builder.Services.AddDbContext<AppDbContext>(options =>
                            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

                        var key = builder.Configuration["Jwt:Key"]!;
                        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                            .AddJwtBearer(options =>
                            {
                                options.TokenValidationParameters = new TokenValidationParameters
                                {
                                    ValidateIssuer = true,
                                    ValidateAudience = true,
                                    ValidateLifetime = true,
                                    ValidateIssuerSigningKey = true,
                                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                                    ValidAudience = builder.Configuration["Jwt:Audience"],
                                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                                };
                            });

                        builder.Services.AddCors(options =>
                        {
                            options.AddPolicy("AllowFrontend", policy =>
                                policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
                        });
                        builder.Services.AddAuthorization();
                        builder.Services.AddSingleton<StatefulServiceContext>(serviceContext);
                        builder.Services.AddScoped<ITripService, TripServiceLogic>();
                        builder.Services.AddScoped<IDestinationService, DestinationService>();
                        builder.Services.AddScoped<IActivityService, ActivityService>();
                        builder.Services.AddScoped<IExpenseService, ExpenseService>();
                        builder.Services.AddScoped<IChecklistService, ChecklistService>();

                        builder.WebHost
                            .UseKestrel()
                            .UseContentRoot(Directory.GetCurrentDirectory())
                            .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                            .UseUrls(url);

                        builder.Services.AddControllers()
                            .AddJsonOptions(options =>
                            {
                                options.JsonSerializerOptions.Converters.Add(
                                    new System.Text.Json.Serialization.JsonStringEnumConverter());
                            });
                        builder.Services.AddEndpointsApiExplorer();
                        builder.Services.AddSwaggerGen(options =>
                        {
                            options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                            {
                                Name = "Authorization",
                                Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                                Scheme = "bearer",
                                BearerFormat = "JWT",
                                In = Microsoft.OpenApi.Models.ParameterLocation.Header
                            });
                            options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                            {
                                {
                                    new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                                    {
                                        Reference = new Microsoft.OpenApi.Models.OpenApiReference
                                        {
                                            Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                            Id = "Bearer"
                                        }
                                    },
                                    new string[] {}
                                }
                            });
                        });

                        var app = builder.Build();

                        if (app.Environment.IsDevelopment())
                        {
                            app.UseSwagger();
                            app.UseSwaggerUI();
                        }

                        app.UseCors("AllowFrontend");
                        app.UseAuthentication();
                        app.UseAuthorization();
                        app.MapControllers();

                        return app;
                    }))
            };
        }
    }
}
