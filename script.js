// YASH JAIN Portfolio JavaScript
// Handles theme toggle, FAQ accordion, mobile navigation, portfolio interactions, and smooth scrolling

document.addEventListener('DOMContentLoaded', function() {
    // Ensure page starts at the top
    window.scrollTo(0, 0);
    
    // Remove any hash from URL to prevent auto-scrolling
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
    
    // Initialize all functionality
    initThemeToggle();
    initFAQ();
    initMobileNav();
    initSmoothScrolling();
    initAnimations();
    // initHeaderScroll(); // reverted
    // initParallax(); // reverted
    initPortfolioInteractions();
	initVideoHoverPlay();
    initContactForm();
    initSkillBars();
});

// Theme Toggle Functionality (Light/Dark Mode)
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme: respect saved; else respect system; default to light
    const shouldStartDark = savedTheme ? (savedTheme === 'dark') : prefersDark;
    body.classList.toggle('dark-mode', shouldStartDark);
    updateThemeIcon(shouldStartDark);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        
        // Save theme preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update icon
        updateThemeIcon(isDark);
        
        // Add animation effect
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Listen for system theme changes
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    if (media && media.addEventListener) {
        media.addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                body.classList.toggle('dark-mode', e.matches);
                updateThemeIcon(e.matches);
            }
        });
    }
}

function updateThemeIcon(isDark) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    if (isDark) {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// FAQ Accordion Functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
        });
        
        // Keyboard navigation support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Mobile Navigation Toggle
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            this.classList.toggle('active');

            // Body scroll locking removed
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                // Body scroll locking removed
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                // Body scroll locking removed
            }
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Enhanced Scroll-based Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered animation delays
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                setTimeout(() => {
                    entry.target.classList.add('animate-fade-in');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.portfolio-item, .testimonial-card, .service-card, .skill-category, .faq-item, .contact-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add floating animation to stats
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
        stat.style.animationDelay = `${index * 0.2}s`;
        stat.classList.add('animate-float');
    });
    
    // Add shimmer effect to buttons on hover
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('animate-shimmer');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('animate-shimmer');
        });
    });
}

// Header Scroll Effect
// initHeaderScroll and initParallax removed

// Portfolio Interactions
function initPortfolioInteractions() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const playButtons = document.querySelectorAll('.play-btn');
    
    // Portfolio item hover effects
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Play button interactions
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Add click animation
            this.style.transform = 'scale(1.3)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Show video modal (placeholder)
            showVideoModal(this.closest('.portfolio-item'));
        });
    });
}

// Hover to Play/Pause for portfolio videos
function initVideoHoverPlay() {
	const videos = document.querySelectorAll('.portfolio-video');

	videos.forEach(video => {
		// Ensure instant playback without audio surprises
		video.muted = true;
		video.preload = 'metadata';

		video.addEventListener('mouseenter', function() {
			// User hover counts as a gesture in most browsers
			try { this.play(); } catch (e) { /* no-op */ }
		});

		video.addEventListener('mouseleave', function() {
			this.pause();
			this.currentTime = 0;
		});

		// Extra safety: pause/reset if scrolled out of view
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) {
					video.pause();
					video.currentTime = 0;
				}
			});
		});
		observer.observe(video);
	});
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                // Reset width and animate
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            // Validate form
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Submit to Formspree (replace with your endpoint in index.html action)
            const endpoint = this.getAttribute('action');
            fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(async (response) => {
                if (response.ok) {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    this.reset();
                } else {
                    try {
                        const data = await response.json();
                        const firstError = data?.errors?.[0]?.message || 'Something went wrong.';
                        showNotification(firstError, 'error');
                    } catch (_) {
                        showNotification('Failed to send. Please try again later.', 'error');
                    }
                }
            }).catch(() => {
                showNotification('Network error. Please try again.', 'error');
            }).finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

// Video Modal (Placeholder)
function showVideoModal(portfolioItem) {
    const title = portfolioItem.querySelector('.portfolio-title').textContent;
    const description = portfolioItem.querySelector('.portfolio-description').textContent;
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'video-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'video-modal-content';
    modal.style.cssText = `
        background-color: var(--background-card);
        padding: 2rem;
        border-radius: 1rem;
        max-width: 600px;
        width: 90%;
        text-align: center;
        transform: scale(0.9);
        transition: transform 0.3s ease;
        border: 1px solid var(--border-color);
    `;
    
    modal.innerHTML = `
        <h3 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1rem;">
            ${title}
        </h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
            ${description}
        </p>
        <div style="background: var(--background-secondary); padding: 2rem; border-radius: 0.5rem; margin-bottom: 2rem;">
            <i class="fas fa-play-circle" style="font-size: 3rem; color: var(--accent-primary); margin-bottom: 1rem;"></i>
            <p style="color: var(--text-muted);">Video preview would be displayed here</p>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn btn-secondary" onclick="closeVideoModal()">
                Close
            </button>
            <button class="btn btn-primary" onclick="requestFullVideo('${title}')">
                Request Full Video
            </button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeVideoModal();
        }
    });
}

function closeVideoModal() {
    const overlay = document.querySelector('.video-modal-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.querySelector('.video-modal-content').style.transform = 'scale(0.9)';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

function requestFullVideo(title) {
    closeVideoModal();
    showNotification(`Request sent for ${title}. I'll contact you with the full video!`, 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background-color: ${type === 'success' ? 'var(--accent-green)' : type === 'error' ? 'var(--accent-primary)' : 'var(--accent-tertiary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: var(--shadow-medium);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Service Button Click Handlers
document.addEventListener('DOMContentLoaded', function() {
    const serviceButtons = document.querySelectorAll('.service-card .btn-primary');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Show service inquiry modal
            const serviceName = this.closest('.service-card').querySelector('.service-title').textContent;
            showServiceModal(serviceName);
        });
    });
});

// Service Inquiry Modal
function showServiceModal(serviceName) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'service-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'service-modal-content';
    modal.style.cssText = `
        background-color: var(--background-card);
        padding: 2rem;
        border-radius: 1rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        transform: scale(0.9);
        transition: transform 0.3s ease;
        border: 1px solid var(--border-color);
    `;
    
    modal.innerHTML = `
        <h3 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1rem;">
            Interested in ${serviceName}?
        </h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
            Let's discuss your project requirements and create something amazing together. 
            I'll provide a detailed quote based on your specific needs.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn btn-secondary" onclick="closeServiceModal()">
                Maybe Later
            </button>
            <button class="btn btn-primary" onclick="proceedToContact('${serviceName}')">
                Get Quote
            </button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeServiceModal();
        }
    });
}

function closeServiceModal() {
    const overlay = document.querySelector('.service-modal-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.querySelector('.service-modal-content').style.transform = 'scale(0.9)';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

function proceedToContact(serviceName) {
    closeServiceModal();
    
    // Scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pre-fill the project type field
        setTimeout(() => {
            const projectTypeField = document.querySelector('input[placeholder="Project Type"]');
            if (projectTypeField) {
                projectTypeField.value = serviceName;
                projectTypeField.focus();
            }
        }, 500);
    }
    
    showNotification(`Great choice! Let's discuss your ${serviceName} project.`, 'success');
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Debounce scroll events
const debouncedScrollHandler = debounce(function() {
    // Any scroll-based functionality can be added here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading states for better UX
function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    return function removeLoadingState() {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// Error handling for failed operations
function showError(message) {
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background-color: var(--error-red);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    errorMessage.textContent = message;
    
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
        errorMessage.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        errorMessage.style.transform = 'translateX(100%)';
        setTimeout(() => {
            errorMessage.remove();
        }, 300);
    }, 5000);
}

// Scroll to Top Function for Logo Click
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Export functions for potential external use
window.YashJainPortfolio = {
    showNotification,
    showVideoModal,
    closeVideoModal,
    showServiceModal,
    closeServiceModal,
    proceedToContact,
    scrollToTop
};
