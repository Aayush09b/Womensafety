const text = "Welcome To Raksha";
let index = 0;

function typeWriter() {
    const welcomeText = document.getElementById('welcome-text');
    if (index < text.length) {
        welcomeText.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 100); // Adjust the typing speed here (in milliseconds)
    }
}


typeWriter();