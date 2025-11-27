/**
 * 系统主题管理
 * 支持 light、dark、system 三种模式
 * */
export default function useTheme() {
    const STORAGE_KEY = "youloge.theme";
    
    // 获取当前应用的主题类
    const getCurrentTheme = () => {
        const html = document.documentElement;
        return html.classList.contains('dark') ? 'dark' : 'light';
    };
    
    // 切换主题类
    const toggleTheme = (theme) => {
        const html = document.documentElement;
        html.classList.remove('light', 'dark');
        html.classList.add(theme);
        return theme;
    };
    
    // 应用指定主题
    const applyTheme = (theme) => {
        let actualTheme;
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            actualTheme = toggleTheme(systemTheme);
        } else {
            actualTheme = toggleTheme(theme);
        }
        return actualTheme;
    };
    
    // 监听系统主题变化
    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    themeMedia.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        // 只有「跟随系统」模式下，才同步系统主题变化
        if (savedTheme === 'system') {
            toggleTheme(e.matches ? "dark" : "light");
        }
    });
    
    // 初始化主题
    const savedTheme = localStorage.getItem(STORAGE_KEY) || 'system';
    const currentTheme = applyTheme(savedTheme);
    
    // 设置主题方法
    const setTheme = (theme) => {
        localStorage.setItem(STORAGE_KEY, theme);
        return applyTheme(theme);
    };
    
    // 切换主题方法（light/dark 之间切换）
    const switchTheme = () => {
        const current = getCurrentTheme();
        const newTheme = current === 'dark' ? 'light' : 'dark';
        return setTheme(newTheme);
    };
    
    return {
        theme: savedTheme,
        currentTheme, // 当前实际应用的主题
        setTheme,
        switchTheme,
        isDark: currentTheme === 'dark',
        isLight: currentTheme === 'light',
        isSystem: savedTheme === 'system'
    };
}