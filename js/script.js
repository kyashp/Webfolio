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

document.getElementById('main-logo').addEventListener('click',(e)=>{
    e.preventDefault();
    const curr= localStorage.getItem('theme');
    if(curr){
        document.documentElement.setAttribute('theme',curr);
        window.scrollTo({top:0, behavior:"smooth"});
    }
    else{
        window.scrollTo({top:0, behavior:"smooth"});
    }
});

const burg= document.querySelector('.hamburger');

function toggleMenu(){
    const navigation= document.querySelector('.nav');

    burg.classList.toggle('active');
    navigation.classList.toggle('active');
}
burg.addEventListener('click', toggleMenu());

const translations=[
  { text: "Hi, ", language: "English", dir: "ltr" },
  { text: "வணக்கம், ", language: "Tamil", dir: "ltr" },
  { text: "Hola, ", language: "Spanish", dir: "ltr" },
  { text: "Salut, ", language: "French", dir: "ltr" },
  { text: "Hallo, ", language: "German", dir: "ltr" },
  { text: "Ciao, ", language: "Italian", dir: "ltr" },
  { text: "こんにちは, ", language: "Japanese", dir: "ltr" },
  { text: "안녕하세요, ", language: "Korean", dir: "ltr" },
  { text: "你好, ", language: "Chinese (Simplified)", dir: "ltr" },
  { text: "Привет, ", language: "Russian", dir: "ltr" },
  { text: "مرحبًا، ", language: "Arabic", dir: "rtl" },
  { text: "नमस्ते, ", language: "Hindi", dir: "ltr" },
  { text: "Selam, ", language: "Turkish", dir: "ltr" },
  { text: "Hai, ", language: "Malay", dir: "ltr" }
]

const container=document.querySelector('#salutation');
let currindex=0;

function typing(text, callback){
    let index=0;
    container.textContent='';
    container.classList.add('typing');
    function type(){
        if(index<text.length){
            container.textContent=text.slice(0,index+1);
            index++;
            setTimeout(type,100);
        }
        else{
            container.classList.remove('typing');
            setTimeout(callback, 1000);
        }
    }
    type();
}

function cycle(){
    const {text, dir}= translations[currindex];
    typing(text,()=>{
        container.classList.toggle('rtl', dir==='rtl');
        currindex=(currindex+1) % translations.length;
        cycle();
    })
}
cycle();