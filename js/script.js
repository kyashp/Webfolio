function themeChange(){
    const light = document.getElementById('light-mode');
    const dark = document.getElementById('dark-mode');

    if (light.classList.contains('visible')){
        light.classList.remove('visible');
        light.classList.add('disappear');
        dark.classList.add('visible');
        dark.classList.add('appear');

        document.documentElement.setAttribute('theme', 'dark');
        localStorage.setItem('theme','dark');
    }
    else{
        dark.classList.remove('visible');
        dark.classList.add('disappear');
        light.classList.add('visible');
        light.classList.add('appear');

        document.documentElement.removeAttribute('theme');
        localStorage.removeItem('theme');
    }
}