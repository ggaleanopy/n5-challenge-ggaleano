using Domain;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net;
using System.Net.Http.Json;
using System.Security;

namespace Integration.Test
{
    [TestClass]
    public class PermissionControllerTest
    {
        private WebApplicationFactory<Program> _factory;
        private HttpClient _client;

        [TestInitialize]
        public void Initialize()
        {
            _factory = new WebApplicationFactory<Program>();
            _client = _factory.CreateDefaultClient();
        }

        [TestMethod]
        public async Task RequestPermission_ReturnNewPermissionData()
        {
            var permission = new Permission
            {
                NombreEmpleado = "Kevin",
                ApellidoEmpleado = "Bacon",
                TipoPermiso = 1,
                FechaPermiso = DateTime.Now
            };

            var response = await _client.PostAsJsonAsync("/api/Permission", permission);
            response.EnsureSuccessStatusCode();

            var contentString = await response.Content.ReadAsStringAsync();
            var newPermission = System.Text.Json.JsonSerializer.Deserialize<Permission>(contentString, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
            Assert.IsInstanceOfType(permission, typeof(Permission));
            Assert.AreNotEqual(permission.Id, newPermission.Id);
            Assert.AreEqual(permission.NombreEmpleado, newPermission.NombreEmpleado);
            Assert.AreEqual(permission.ApellidoEmpleado, newPermission.ApellidoEmpleado);
        }

        [TestMethod]
        public async Task ModifyPermission_ReturnModifiedPermissionData()
        {
            var permission = new Permission
            {
                Id = 1,
                NombreEmpleado = "Kevin de Jesús",
                ApellidoEmpleado = "Bacon",
                TipoPermiso = 1,
                FechaPermiso = DateTime.Now
            };

            var response = await _client.PutAsJsonAsync("/api/Permission", permission);
            response.EnsureSuccessStatusCode();

            var contentString = await response.Content.ReadAsStringAsync();
            var newPermission = System.Text.Json.JsonSerializer.Deserialize<Permission>(contentString, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
            Assert.IsInstanceOfType(permission, typeof(Permission));
            Assert.AreNotEqual(permission, newPermission);
        }

        [TestMethod]
        public async Task GetPermissions_ReturnsListOfPermissions()
        {
            var response = await _client.GetAsync("/api/Permission");
            response.EnsureSuccessStatusCode();

            
            var contentString = await response.Content.ReadAsStringAsync();
            var permissions = System.Text.Json.JsonSerializer.Deserialize<List<Permission>>(contentString, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
            Assert.IsNotNull(permissions);
            Assert.IsInstanceOfType(permissions, typeof(List<Permission>));
        }

        [TestMethod]
        public async Task GetPermissionById_ReturnsRequestedData()
        {
            int permissionId = 1;
            string requestUrl = $"/api/Permission/permissionId?permissionId={permissionId}";
            var response = await _client.GetAsync(requestUrl);
            response.EnsureSuccessStatusCode();

            var contentString = await response.Content.ReadAsStringAsync();
            var reqPermission = System.Text.Json.JsonSerializer.Deserialize<Permission>(contentString, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
            Assert.IsInstanceOfType(reqPermission, typeof(Permission));
            Assert.AreEqual(reqPermission.Id, permissionId);
        }

        
        [TestCleanup]
        public void Cleanup()
        {
            _client.Dispose();
            _factory.Dispose();
        }
    }
}