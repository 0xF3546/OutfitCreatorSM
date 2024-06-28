using Microsoft.AspNetCore.Mvc.Testing;

namespace webapi.Tests.Controllers
{
    [TestFixture]
    public class AccountControllerTests
    {
        [Test]
        public async Task Can_Not_Get_Invalid_User()
        {
            await using var application = new WebApplicationFactory<webapi.Controllers.AccountController>();
            using var client = application.CreateClient();

            var response = await client.GetAsync("/123/User");

            Assert.That(response.StatusCode.ToString(), Is.EqualTo("NotFound"));
        }
    }
}
