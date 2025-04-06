document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validate form data
        if (!validateForm(formData)) {
            return;
        }

        // Simulate form submission
        const submitButton = contactForm.querySelector('.submit-btn');
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        } catch (error) {
            alert('Sorry, there was an error sending your message. Please try again later.');
        } finally {
            submitButton.textContent = 'Send Message';
            submitButton.disabled = false;
        }
    });
});

function validateForm(formData) {
    // Validate name
    if (formData.name.trim().length < 2) {
        alert('Please enter a valid name');
        return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Validate subject
    if (formData.subject.trim().length < 3) {
        alert('Please enter a valid subject');
        return false;
    }

    // Validate message
    if (formData.message.trim().length < 10) {
        alert('Please enter a message with at least 10 characters');
        return false;
    }

    return true;
}