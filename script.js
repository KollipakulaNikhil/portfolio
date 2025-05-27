// Mobile Navigation Functions
const navbar = document.querySelector(".dropdown");

function hamburg() {
    navbar.style.transform = "translateY(0px)";
    document.body.style.overflow = "hidden";
}

function cancel() {
    navbar.style.transform = "translateY(-500px)";
    document.body.style.overflow = "";
}

// Typewriter Animation
const typed = new Typed(".typewriter-text", {
    strings: ["STUDENT", "AI Engineer"],
    typeSpeed: 100,
    backSpeed: 50,
    loop: true,
    smartBackspace: true,
    backDelay: 1000,
    startDelay: 500
});

// Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/send_message', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                alert('Message sent successfully!');
                form.reset();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending message');
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Close mobile menu when clicking links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.dropdown .links a');
    links.forEach(link => {
        link.addEventListener('click', cancel);
    });
});