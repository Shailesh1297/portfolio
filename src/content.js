import aboutHtml from './content/about.html';
import skillsHtml from './content/skills.html';
import projectsHtml from './content/projects.html';
import experienceHtml from './content/experience.html';
import contactHtml from './content/contact.html';

// Content Management System
export const portfolioContent = {
    about: {
        title: "About Me",
        color: "#6366f1", // Indigo
        content: aboutHtml
    },

    skills: {
        title: "Skills",
        color: "#ec4899", // Pink
        content: skillsHtml
    },

    projects: {
        title: "Projects",
        color: "#8b5cf6", // Purple
        content: projectsHtml
    },

    experience: {
        title: "Experience",
        color: "#14b8a6", // Teal
        content: experienceHtml
    },

    contact: {
        title: "Contact",
        color: "#f59e0b", // Amber
        content: contactHtml
    }
};

// Modal Management
class ModalManager {
    constructor() {
        this.overlay = document.getElementById('modal-overlay');
        this.body = document.getElementById('modal-body');
        this.closeBtn = document.getElementById('modal-close');
        this.onCloseCallback = null;

        this.init();
    }

    setOnCloseCallback(callback) {
        this.onCloseCallback = callback;
    }

    init() {
        // Close button click
        this.closeBtn.addEventListener('click', () => this.close());

        // Click outside modal to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(section) {
        const content = portfolioContent[section];
        if (!content) return;

        this.body.innerHTML = content.content;

        // Reveal protected contact info if opening contact section
        if (section === 'contact') {
            this.revealContactInfo();
        }

        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    revealContactInfo() {
        const contactLinks = this.body.querySelectorAll('.contact-item[data-type]');
        contactLinks.forEach(link => {
            const type = link.getAttribute('data-type');
            const valueElement = link.querySelector('.contact-value');

            if (type === 'email') {
                const user = atob(link.getAttribute('data-u'));
                const domain = atob(link.getAttribute('data-d'));
                const email = `${user}@${domain}`;
                link.setAttribute('href', `mailto:${email}`);
                if (valueElement) valueElement.textContent = email;
            } else if (type === 'phone') {
                const country = atob(link.getAttribute('data-c'));
                const prefix = atob(link.getAttribute('data-p'));
                const rest = atob(link.getAttribute('data-r'));
                const phone = `+${country} ${prefix} ${rest}`;
                link.setAttribute('href', `tel:+${country}${prefix}${rest}`);
                if (valueElement) valueElement.textContent = phone;
            }
        });
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';

        // Notify game that modal is closed
        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }
}

// Initialize modal manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
});
