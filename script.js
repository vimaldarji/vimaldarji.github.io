/**
 * Vimal G. Darji - Portfolio Website Script
 * Fully upgraded to support a single-page scrolling experience, active scroll spy,
 * AJAX form submissions via Web3Forms API, and interactive NDA-safe autofill triggers.
 */

// Global configuration variables
// Register a free account at https://web3forms.com/ to get your Access Key
const WEB3FORMS_ACCESS_KEY = "8e02ad60-f3ab-41ca-bf7e-e7573ee0ee10"; 

// Initialize everything on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize skill reveal animation
    animateSkillsOnScroll();
    
    // Initialize active scroll-spy highlighting
    initScrollSpy();
    
    // Initialize AJAX contact form submission
    handleContactFormSubmission();
    
    // Initialize interactive NDA-Secure Project trigger buttons
    initNdaProjectButtons();
    
    // Initialize scroll-to behavior for nav links (since we converted to single-page)
    initSmoothScrollNavigation();
});

/**
 * Handles smooth scrolling fallback for navigation clicks
 */
function initSmoothScrollNavigation() {
    const navLinks = document.querySelectorAll('nav a, .hero-btn');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
}

/**
 * Scroll spy using IntersectionObserver to highlight current active navigation items
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('nav a');
    
    const options = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger highlight when section occupies main center viewport
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Trigger Intersection Observer animations on skill logos
 */
function animateSkillsOnScroll() {
    const skillLogos = document.querySelectorAll('.skill-logo');
    
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, options);

    skillLogos.forEach(logo => {
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(15px) scale(0.95)';
        logo.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(logo);
    });
}

/**
 * Connects the "Request Architecture Details" button to the contact form
 */
function initNdaProjectButtons() {
    const ndaButtons = document.querySelectorAll('.nda-btn');
    const contactFormSection = document.getElementById('contact');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    const nameField = document.getElementById('name');
    
    ndaButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectName = button.getAttribute('data-project');
            
            if (subjectField && messageField && contactFormSection) {
                // Populate standard message subject & pre-filled NDA secure details template
                subjectField.value = `NDA Architecture Request - ${projectName}`;
                messageField.value = `Hi Vimal,\n\nI reviewed your portfolio case study for "${projectName}". Since this project is protected under NDA, I would love to request a secure technical briefing and review the system architecture/database design parameters with you.\n\nPlease let me know your availability for a brief call.`;
                
                // Smooth scroll to the contact form
                const headerOffset = 80;
                const elementPosition = contactFormSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Focus name input so they can start typing
                setTimeout(() => {
                    if (nameField) nameField.focus();
                }, 800);
            }
        });
    });
}

/**
 * Handle form AJAX validation and submission via background Fetch API
 */
function handleContactFormSubmission() {
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('formToast');
    
    if (!form || !toast) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const submitBtn = form.querySelector('.submit-btn');

        // Reset notification box
        toast.style.display = 'none';
        toast.className = 'form-toast';

        // Check if Web3Forms key is configured
        if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE" || WEB3FORMS_ACCESS_KEY === "") {
            // Web3Forms API Key is not set yet! Show warning toast and redirect via WhatsApp fallback
            toast.textContent = "API Access Key is missing! Opening WhatsApp fallback chat to submit your message directly...";
            toast.className = 'form-toast error';
            toast.style.display = 'block';
            
            // Format a neat WhatsApp pre-filled text
            const whatsappText = `Hi Vimal, I am trying to contact you from your portfolio website.\n\n*Name:* ${name}\n*Email:* ${email}\n*Subject:* ${subject}\n\n*Message:* ${message}`;
            const whatsappUrl = `https://wa.me/911234567890?text=${encodeURIComponent(whatsappText)}`;
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 2000);
            
            return;
        }

        // Change button state to loading
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending Message...</span> <i class="fas fa-spinner fa-spin"></i>`;

        try {
            // Post submission in the background using Web3Forms
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    from_name: "Portfolio Inquiry - Vimal Darji"
                })
            });

            const result = await response.json();

            if (result.success) {
                // Success feedback
                toast.textContent = "Your message was sent successfully! I will get back to you shortly.";
                toast.className = 'form-toast success';
                toast.style.display = 'block';
                form.reset();
            } else {
                throw new Error(result.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("AJAX form submission failure:", error);
            // Error feedback
            toast.textContent = "Failed to send message in the background. Opening native email client...";
            toast.className = 'form-toast error';
            toast.style.display = 'block';
            
            // Safe fallback: open mailto link as backup
            setTimeout(() => {
                const mailtoLink = `mailto:vimaldarjiv26@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                window.location.href = mailtoLink;
            }, 2500);
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
}
