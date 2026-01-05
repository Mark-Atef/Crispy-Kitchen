// ==========================================
// CONTACT.JS - Contact Form Functionality
// Create this as: js/contact.js
// ==========================================

// Form validation rules
const validationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[\p{L}\s'-]+$/u, // Supports all Unicode letters
        errorMessages: {
            required: 'Name is required',
            minLength: 'Name must be at least 2 characters',
            maxLength: 'Name cannot exceed 100 characters',
            pattern: 'Name can only contain letters, spaces, hyphens, and apostrophes'
        }
    },
    email: {
        required: true,
        maxLength: 254, // RFC 5321 max length
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessages: {
            required: 'Email is required',
            maxLength: 'Email cannot exceed 254 characters',
            pattern: 'Please enter a valid email address'
        }
    },
    phone: {
        required: false,
        pattern: /^[\d\s\-\(\)]+$/,
        errorMessages: {
            pattern: 'Please enter a valid phone number'
        }
    },
    subject: {
        required: true,
        errorMessages: {
            required: 'Please select a subject'
        }
    },
    message: {
        required: true,
        minLength: 10,
        errorMessages: {
            required: 'Message is required',
            minLength: 'Message must be at least 10 characters'
        }
    }
};

// Validate single field
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];

    if (!rules) return { valid: true };

    // Check required
    if (rules.required && !value.trim()) {
        return {
            valid: false,
            message: rules.errorMessages.required
        };
    }

    // Check max length FIRST (prevent DOS)
    if (rules.maxLength && value.length > rules.maxLength) {
        return {
            valid: false,
            message: rules.errorMessages.maxLength
        };
    }

    // Check min length
    if (rules.minLength && value.trim().length < rules.minLength) {
        return {
            valid: false,
            message: rules.errorMessages.minLength
        };
    }

    // Check pattern
    if (rules.pattern && value.trim() && !rules.pattern.test(value.trim())) {
        return {
            valid: false,
            message: rules.errorMessages.pattern
        };
    }

    return { valid: true };
}

// Show error message
function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputElement = document.getElementById(fieldName);

    if (errorElement) {
        errorElement.textContent = message;
    }

    if (inputElement) {
        inputElement.classList.add('invalid');
        inputElement.classList.remove('valid');
    }
}

// Clear error message
function clearError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputElement = document.getElementById(fieldName);

    if (errorElement) {
        errorElement.textContent = '';
    }

    if (inputElement) {
        inputElement.classList.remove('invalid');
        if (inputElement.value.trim()) {
            inputElement.classList.add('valid');
        }
    }
}

// Validate entire form
function validateForm(formData) {
    let isValid = true;
    const errors = {};

    for (const [fieldName, value] of formData.entries()) {
        const validation = validateField(fieldName, value);

        if (!validation.valid) {
            isValid = false;
            errors[fieldName] = validation.message;
            showError(fieldName, validation.message);
        } else {
            clearError(fieldName);
        }
    }

    return { isValid, errors };
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (successMessage) {
        successMessage.style.display = 'flex';
        errorMessage.style.display = 'none';

        // Scroll to message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
}

// Show error message
function showErrorMessage() {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (errorMessage) {
        errorMessage.style.display = 'flex';
        successMessage.style.display = 'none';

        // Scroll to message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
}

// Submit form (demo - no actual backend)
function submitForm(formData) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, you would send data to your backend here
            console.log('Form submitted with data:', Object.fromEntries(formData));
            resolve({ success: true });
        }, 1000);
    });
}

// Reset form
function resetForm(form) {
    form.reset();

    // Clear all validation states
    const fields = ['name', 'email', 'phone', 'subject', 'message'];
    fields.forEach(field => {
        clearError(field);
        const inputElement = document.getElementById(field);
        if (inputElement) {
            inputElement.classList.remove('valid', 'invalid');
        }
    });
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    // Real-time validation on blur
    const fields = ['name', 'email', 'phone', 'subject', 'message'];

    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);

        if (field) {
            // Validate on blur
            field.addEventListener('blur', () => {
                const validation = validateField(fieldName, field.value);

                if (!validation.valid) {
                    showError(fieldName, validation.message);
                } else {
                    clearError(fieldName);
                }
            });

            // Clear error on input
            field.addEventListener('input', () => {
                if (field.classList.contains('invalid')) {
                    const validation = validateField(fieldName, field.value);
                    if (validation.valid) {
                        clearError(fieldName);
                    }
                }
            });
        }
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);

        // Validate form
        const { isValid } = validateForm(formData);

        if (!isValid) {
            showErrorMessage();
            return;
        }

        // Disable submit button
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        try {
            // Submit form (demo)
            const result = await submitForm(formData);

            if (result.success) {
                showSuccessMessage();
                resetForm(contactForm);
            } else {
                showErrorMessage();
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage();
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });

    console.log('📧 Contact page loaded successfully!');
});