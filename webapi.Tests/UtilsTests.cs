using webapi.Components.Utilities;

namespace webapi.Tests
{
    [TestFixture]
    public class UtilsTests
    {
        [Test]
        public void HexToRgb_ValidHex_ReturnsRgbValues()
        {
            // Arrange
            string hex = "#FF0000"; // Red

            // Act
            var (r, g, b) = Utils.HexToRgb(hex);
            Assert.Multiple(() =>
            {

                // Assert
                Assert.That(r, Is.EqualTo(255));
                Assert.That(g, Is.EqualTo(0));
                Assert.That(b, Is.EqualTo(0));
            });
        }

        [Test]
        public void HexToRgb_NullHex_ReturnsBlack()
        {
            // Arrange
            string? hex = null;

            // Act
            var (r, g, b) = Utils.HexToRgb(hex);
            Assert.Multiple(() =>
            {

                // Assert
                Assert.That(r, Is.EqualTo(0));
                Assert.That(g, Is.EqualTo(0));
                Assert.That(b, Is.EqualTo(0));
            });
        }

        [Test]
        public void HexToRgb_InvalidHex_ThrowsException()
        {
            // Arrange
            string hex = "invalid"; // Invalid hex value

            // Act & Assert
            Assert.Throws<Exception>(() => Utils.HexToRgb(hex));
        }
    }
}
