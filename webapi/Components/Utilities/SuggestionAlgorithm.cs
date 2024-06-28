using webapi.Components.Unnamed;

namespace webapi.Components.Utilities
{
    public class SuggestionAlgorithm
    {
        private readonly List<Component> CurrentComponents;
        private readonly List<Component> Components;
        private readonly string Gender;
        private Component? component = null;
        public SuggestionAlgorithm(List<Component> currentComponents, string gender, List<Component> components)
        {
            CurrentComponents = currentComponents;
            Components = components;
            Gender = gender;

            for (int i = 0; i < currentComponents.Count; i++)
            {
                for (int j = 0; j < components.Count; j++)
                {
                    if (currentComponents[i].Name == components[j].Name && currentComponents[i].ComponentType == components[j].ComponentType)
                    {
                        currentComponents[i] = components[j];
                    }
                }
            }
        }

        public Component? GetComponent()
        {
            component = GetBestMatchingComponent();
            return component;
        }

        public Component? GetBestMatchingComponent()
        {
            List<Component> NearlySameColor = GetComponentsWithNearlySameColor();
            List<Component> SameMatches = GetComponentsWithSameMatches();

            if (SameMatches.Count > 0)
            {
                foreach (var match in SameMatches)
                {
                    foreach (Component component in CurrentComponents)
                    {
                        if (component.Id != match.Id && component.ComponentType != match.ComponentType && (match.Gender.ToLower() == Gender.ToLower() || match.Gender.ToLower() == Enums.Gender.Both.ToString().ToLower()))
                        {
                            return match;
                        }
                    }
                }
            }
            if (NearlySameColor.Count > 0)
            {
                foreach (var match in NearlySameColor)
                {
                    foreach (Component component in CurrentComponents)
                    {
                        if (component.Id != match.Id && component.ComponentType != match.ComponentType && (match.Gender.ToLower() == Gender.ToLower() || match.Gender.ToLower() == Enums.Gender.Both.ToString().ToLower()))
                        {
                            return match;
                        }
                    }
                }
            }
            return null;
        }

        public List<Component> GetComponentsWithNearlySameColor()
        {
            List<Component> nearlySame = [];

            foreach (Component comp in CurrentComponents)
            {
                string? hexColor1 = comp.Color;
                if (hexColor1 == null) 
                {
                    return nearlySame;
                }

                foreach (Component otherComp in Components)
                {
                    string? hexColor2 = otherComp.Color;
                    if (hexColor2 == null)
                    {
                        return nearlySame;
                    }

                    var (R1, G1, B1) = Utils.HexToRgb(hexColor1);
                    var (R2, G2, B2) = Utils.HexToRgb(hexColor2);

                    double distance = Math.Sqrt(Math.Pow(R2 - R1, 2)
                                                + Math.Pow(G2 - G1, 2)
                                                + Math.Pow(B2 - B1, 2));
                    if (distance < 100)
                    {
                        nearlySame.Add(otherComp);
                    }
                }
            }
            return nearlySame;
        }

        public List<Component> GetComponentsWithSameMatches()
        {
            List<Component> sameMatches = new List<Component>();
            foreach (Component component in CurrentComponents)
            {
                foreach (Component otherComp in Components)
                {
                    if (component != otherComp && (component.Gender.ToLower() == Gender.ToLower() || component.Gender.ToLower() == Enums.Gender.Both.ToString().ToLower()))
                    {
                        sameMatches.Add(component);
                    }
                }
            }
            return sameMatches;
        }
    }
}
