// Navigation highlighting
function updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - sectionHeight/3)) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('onclick').includes(currentSection)) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
    });
}

// Toggle sections
function toggleSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
            scrollToSection(sectionId);
        } else {
            section.style.display = 'none';
        }
    });

    // Update navigation active state
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });
}

// Skill animation on scroll
function animateSkills() {
    const skillLogos = document.querySelectorAll('.skill-logo');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.1 });

    skillLogos.forEach(logo => {
        logo.style.opacity = '0';
        logo.style.transform = 'translateX(-20px)';
        observer.observe(logo);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Show initial section
    toggleSection('summary');
    
    // Initialize skill animations
    animateSkills();
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
        updateActiveSection();
    });
});

// Add hover effect to project cards
const projects = document.querySelectorAll('.project');
projects.forEach(project => {
    project.addEventListener('mouseenter', () => {
        project.style.transform = 'translateY(-10px)';
        project.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    });
    
    project.addEventListener('mouseleave', () => {
        project.style.transform = 'translateY(0)';
        project.style.boxShadow = 'var(--card-shadow)';
    });
});

// Add this part to show "About Me" section on page load
document.addEventListener("DOMContentLoaded", function () {
  toggleSection("summary");
});
