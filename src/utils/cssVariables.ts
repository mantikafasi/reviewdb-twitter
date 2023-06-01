import { waitFor } from "../webpack";

// How to find: Use inspect elements to get hex colour, then
// Object.entries(ReviewDB.Webpack.findByProps("_activeTheme").theme.colors).find(m => m[1] === "#8B98A5")[0]
const Variables = {
    "text-normal": "gray1100",
    "border-color": "borderColor",
    "text-muted": "gray700",
    "button-color": "blue500",
};

waitFor("_activeTheme", m => {
    const root = document.querySelector(":root") as HTMLElement;

    const setVars = () => {
        const { colors } = m.theme;
        for (const [name, twitterColor] of Object.entries(Variables)) {
            if (colors[twitterColor]) {
                root.style.setProperty("--rdb-" + name, colors[twitterColor]);
            }
        }
    };

    m.onThemeChange(setVars);
    setVars();
});
