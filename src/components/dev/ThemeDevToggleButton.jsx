import { useTheme } from "../../hooks/useTheme"

const ThemeDevToggleButton = () => {
    const { theme, toggleTheme} = useTheme();

    return (
        <button onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
    );
};

export default ThemeDevToggleButton;