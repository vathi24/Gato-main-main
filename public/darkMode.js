// Dark Mode Manager
const DarkMode = (() => {
  const THEME_KEY = 'gato-theme-preference';
  
  const themes = {
    light: 'light',
    dark: 'dark'
  };

  // Detectar preferencia de sistema
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? themes.dark 
      : themes.light;
  };

  // Obtener tema almacenado o usar preferencia del sistema
  const getPreferredTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    return stored || getSystemTheme();
  };

  // Aplicar tema al documento
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateToggleButton(theme);
  };

  // Actualizar icono del botón
  const updateToggleButton = (theme) => {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', `Cambiar a modo ${theme === themes.light ? 'oscuro' : 'claro'}`);
      btn.innerHTML = theme === themes.light ? '🌙' : '☀️';
    }
  };

  // Inicializar tema
  const init = () => {
    const preferredTheme = getPreferredTheme();
    applyTheme(preferredTheme);

    // Escuchar cambios en preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      applyTheme(e.matches ? themes.dark : themes.light);
    });

    // Botón de toggle
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === themes.light ? themes.dark : themes.light;
        applyTheme(newTheme);
      });
    }
  };

  return { init };
})();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', DarkMode.init);
} else {
  DarkMode.init();
}
