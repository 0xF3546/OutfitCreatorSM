using webapi.Components.Unnamed;
using webapi.Components.Utilities;

namespace webapi.Tests
{
    public class SuggestionAlgorithmTests
    {
        [Test]
        public void GetComponent_ReturnsBestMatchingComponent()
        {
            // Arrange
            var currentComponents = new List<Component>
            {
                new() { Id = "1", Name = "ComponentA", ComponentType = Components.Enums.ComponentType.Belt, Color = "#FF0000", Gender = "Male" }
            };
            var components = new List<Component>
            {
                new() { Id = "2", Name = "ComponentB", ComponentType = Components.Enums.ComponentType.Scarf, Color = "#FF0505", Gender = "Both" },
                new() { Id = "3", Name = "ComponentC", ComponentType = Components.Enums.ComponentType.CuffLinks, Color = "#00FF00", Gender = "Female" }
            };
            var suggestionAlgorithm = new SuggestionAlgorithm(currentComponents, "Male", components);

            // Act
            var result = suggestionAlgorithm.GetComponent();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.Multiple(() =>
            {
                Assert.That(result.Id, Is.EqualTo("2"));
                Assert.That(result.Name, Is.EqualTo("ComponentB"));
                Assert.That(result.ComponentType, Is.EqualTo(Components.Enums.ComponentType.Scarf));
                Assert.That(result.Color, Is.EqualTo("#FF0505"));
                Assert.That(result.Gender, Is.EqualTo("Both"));
            });
        }

        [Test]
        public void GetComponent_ReturnsNullWhenNoMatchingComponent()
        {
            // Arrange
            var currentComponents = new List<Component>
            {
                new() { Id = "1", Name = "ComponentA", ComponentType = Components.Enums.ComponentType.Belt, Color = "#FF0000", Gender = "Male" }
            };
            var components = new List<Component>();
            var suggestionAlgorithm = new SuggestionAlgorithm(currentComponents, "Female", components);

            // Act
            var result = suggestionAlgorithm.GetComponent();

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public void GetComponentsWithNearlySameColor_ReturnsCorrectComponents()
        {
            // Arrange
            var currentComponents = new List<Component>
            {
                new() { Id = "1", Name = "ComponentA", ComponentType = Components.Enums.ComponentType.Belt, Color = "#FF0000", Gender = "Male" }
            };
            var components = new List<Component>
            {
                new() { Id = "2", Name = "ComponentB", ComponentType = Components.Enums.ComponentType.Scarf, Color = "#FF0505", Gender = "Both" },
                new() { Id = "3", Name = "ComponentC", ComponentType = Components.Enums.ComponentType.CuffLinks, Color = "#00FF00", Gender = "Female" }
            };
            var suggestionAlgorithm = new SuggestionAlgorithm(currentComponents, "Male", components);

            // Act
            var result = suggestionAlgorithm.GetComponentsWithNearlySameColor();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(1));
            Assert.Multiple(() =>
            {
                Assert.That(result[0].Id, Is.EqualTo("2"));
                Assert.That(result[0].Name, Is.EqualTo("ComponentB"));
            });
        }

        [Test]
        public void GetComponentsWithSameMatches_ReturnsCorrectComponents()
        {
            // Arrange
            var currentComponents = new List<Component>
            {
                new() { Id = "1", Name = "ComponentA", ComponentType = Components.Enums.ComponentType.Belt, Color = "#FF0000", Gender = "Male" }
            };
            var components = new List<Component>
            {
                new()  { Id = "2", Name = "ComponentB", ComponentType = Components.Enums.ComponentType.Scarf, Color = "#FF0505", Gender = "Both" },
                new() { Id = "3", Name = "ComponentC", ComponentType = Components.Enums.ComponentType.CuffLinks, Color = "#00FF00", Gender = "Female" }
            };
            var suggestionAlgorithm = new SuggestionAlgorithm(currentComponents, "Male", components);

            // Act
            var result = suggestionAlgorithm.GetComponentsWithSameMatches();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(2));
            Assert.Multiple(() =>
            {
                Assert.That(result[0].Id, Is.EqualTo("1"));
                Assert.That(result[0].Name, Is.EqualTo("ComponentA"));
            });
        }
    }
}
