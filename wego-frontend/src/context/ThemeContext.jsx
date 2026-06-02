import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    const theme = isDark ? {
        bg: "#121212",
        card: "#1e1e1e",
        cardHover: "#2a2a2a",
        nav: "#1e1e1e",
        text: "#e8eaed",
        subtext: "#9aa0a6",
        border: "#3c4043",
        input: "#2d2f31",
        inputText: "#e8eaed",
        inputBorder: "#5f6368",
        badge: "#2d2f31",
        badgeText: "#e8eaed",
        shadow: "0 1px 6px rgba(0,0,0,0.4)",
        shadowHover: "0 4px 12px rgba(0,0,0,0.5)",
    } : {
        bg: "#f8f9fa",
        card: "#ffffff",
        cardHover: "#fafafa",
        nav: "#ffffff",
        text: "#202124",
        subtext: "#5f6368",
        border: "#dadce0",
        input: "#ffffff",
        inputText: "#202124",
        inputBorder: "#dadce0",
        badge: "#f1f3f4",
        badgeText: "#202124",
        shadow: "0 1px 6px rgba(32,33,36,0.12)",
        shadowHover: "0 4px 12px rgba(32,33,36,0.2)",
    };

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);