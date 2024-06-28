using webapi.Components.Identity;

namespace webapi.Components.Utilities
{
    public class Utils
    {
        public static (int R, int G, int B) HexToRgb(string? hex)
        {
            hex ??= "#000000";
            hex ??= "#000000";
            hex = hex.Replace("#", string.Empty);

            if (hex.Length != 6)
                throw new Exception("Ungültiger HEX-Farbenwert.");

            int r, g, b = 0;

            r = Convert.ToInt32(hex.Substring(0, 2), 16);
            g = Convert.ToInt32(hex.Substring(2, 2), 16);
            b = Convert.ToInt32(hex.Substring(4, 2), 16);
            
            return (r, g, b);
        }
    }
}