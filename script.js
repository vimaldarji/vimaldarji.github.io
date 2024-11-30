// Toggle sections
function toggleSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
            section.style.opacity = '0';
            setTimeout(() => {
                section.style.opacity = '1';
            }, 50);
            scrollToSection(sectionId);
        } else {
            section.style.display = 'none';
        }
    });

    // Update navigation active state
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Update URL hash without scrolling
    history.pushState(null, null, `#${sectionId}`);
}

// Smooth scroll with offset for fixed header
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const headerOffset = 80;
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Navigation highlighting
function updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let currentSection = '';
    const headerOffset = 80;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerOffset;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - sectionHeight/3)) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Skill animation
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

// Form validation and submission
function handleContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Basic validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            // Construct mailto link
            const mailtoLink = `mailto:vimaldarjiv26@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            window.location.href = mailtoLink;
            
            // Clear form
            form.reset();
        } catch (error) {
            console.error('Error generating mailto link:', error);
            alert('An error occurred while trying to send the email. Please try again.');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Show initial section based on URL hash or default to summary
    const hash = window.location.hash.slice(1) || 'summary';
    toggleSection(hash);
    
    // Initialize skill animations
    animateSkills();
    
    // Initialize contact form
    handleContactForm();
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
        updateActiveSection();
    });

    // Handle navigation clicks
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').slice(1);
            toggleSection(sectionId);
        });
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1) || 'summary';
    toggleSection(hash);
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
