using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.JSInterop.Infrastructure;
using Microsoft.ServiceFabric.Data;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System;
using System.Collections.Generic;
using System.Fabric;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using UserService.Data;
using UserService.Services;


namespace UserService
{
    /// <summary>
    /// The FabricRuntime creates an instance of this class for each service type instance.
    /// </summary>
    internal sealed class UserService : StatelessService
    {
        public UserService(StatelessServiceContext context)
            : base(context)
        { }

        /// <summary>
        /// Optional override to create listeners (like tcp, http) for this service instance.
        /// </summary>
        /// <returns>The collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new ServiceInstanceListener[]
            {
                new ServiceInstanceListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

                        var builder = WebApplication.CreateBuilder();
                        builder.Services.AddDbContext<AppDbContext>(options =>
                        options.UseSqlServer(
                            builder.Configuration.GetConnectionString("DefaultConnection")));
                        builder.Services.AddCors(options =>
                        {
                            options.AddPolicy("AllowFrontend",
                                policy =>
                                {
                                    policy
                                        .AllowAnyOrigin()
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();
                                        
                                });
                        });
                        builder.Services.AddSingleton<StatelessServiceContext>(serviceContext);
                        builder.WebHost
                                    .UseKestrel()
                                    .UseContentRoot(Directory.GetCurrentDirectory())
                                    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                                    .UseUrls(url);
                        builder.Services.AddSingleton<JwtService>();
                        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                         .AddJwtBearer(options =>
                         {
                             options.TokenValidationParameters = new TokenValidationParameters
                             {
                                ValidateIssuerSigningKey = true,
                                IssuerSigningKey = new SymmetricSecurityKey(
                                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
                                ValidateIssuer = false,
                                ValidateAudience = false
                             };
                         });
                        builder.Services.AddControllers();
                        builder.Services.AddEndpointsApiExplorer();
                        builder.Services.AddSwaggerGen();
                        var app = builder.Build();
                        app.UseRouting();
                        app.UseCors("AllowFrontend");
                        
                        app.UseAuthentication();
                        app.UseAuthorization();
                        if (app.Environment.IsDevelopment())
                        {


                        app.UseSwagger();
                        app.UseSwaggerUI();
                        }
                        app.MapControllers();
                        
                        return app;

                    }))
            };
        }
    }
}
