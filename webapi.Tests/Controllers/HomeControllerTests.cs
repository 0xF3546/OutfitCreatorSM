using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using webapi.Components;
using webapi.Components.Identity;
using webapi.Components.Unnamed;
using webapi.Controllers;
using webapi.Models.Api;

namespace webapi.Tests.Controllers
{
    [TestFixture]
    public class HomeControllerTests
    {
        [Test]
        public void Search_Returns_CorrectResults()
        {
            // Arrange
            var mockUserManager = MockUserManager<UserData>();
            var mockDatabase = new Mock<Database>();

            mockDatabase.Setup(db => db.Users).Returns((Microsoft.EntityFrameworkCore.DbSet<UserData>)new List<UserData>().AsQueryable());
            mockDatabase.Setup(db => db.Posts).Returns((Microsoft.EntityFrameworkCore.DbSet<Post>)new List<Post>().AsQueryable());

            var controller = new HomeController(mockUserManager.Object, mockDatabase.Object);
            string query = "test";

            // Act
            var result = controller.Search(query);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);

            var searchModels = okResult.Value as List<SearchModel>;
            Assert.That(searchModels, Is.Not.Null);

        }

        private Mock<UserManager<TUser>> MockUserManager<TUser>() where TUser : class
        {
            var userStore = new Mock<IUserStore<TUser>>();
            return new Mock<UserManager<TUser>>(userStore.Object, null, null, null, null, null, null, null, null);

        }
    }
}
