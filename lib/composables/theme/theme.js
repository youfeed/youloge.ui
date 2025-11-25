/**
 * 系统主题
 * light dark system
 * */
export default function useTheme() {
    const STORAGE_KEY = "youloge.theme";
    const toggleTheme = (theme) => {
        localStorage.setItem(STORAGE_KEY, theme);
        let doc = document.querySelector("html");
        doc.classList.toggle("light", theme === "light");
        doc.classList.toggle("dark", theme === "dark");
    };
    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    // 系统主题变化时触发
    themeMedia.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        // 只有「跟随系统」模式下，才同步系统主题变化
        if (savedTheme === 'system') {
            toggleTheme(e.matches ? "dark" : "light");
        }
    });
    localStorage.getItem("youloge.theme") || toggleTheme(themeName);
    return {
        theme: localStorage.getItem("youloge.theme"),
        setTheme: (theme) => {
            toggleTheme(theme)
        }
    }
}