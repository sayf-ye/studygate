// ==========================================
// REGISTRATION FORM - Multi-Step Logic
// Ready for Django Integration
// ==========================================

'use strict';

// Global Variables
let currentStep = 1;
const totalSteps = 2;

// ==========================================
// OPEN REGISTRATION FORM
// ==========================================
function openRegistrationForm() {
    const modal = document.getElementById('registrationModal');
    const form = document.getElementById('registrationForm');
    
    // Get institute name from page title or header
    const instituteTitle = document.querySelector('.institute-title');
    const instituteName = instituteTitle ? instituteTitle.textContent.trim() : 'المعهد';
    
    // Set institute name in modal
    document.getElementById('instituteName').textContent = instituteName;
    document.getElementById('instituteNameInput').value = instituteName;
    
    // Reset form
    resetForm();
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ==========================================
// CLOSE REGISTRATION FORM
// ==========================================
function closeRegistrationForm() {
    const modal = document.getElementById('registrationModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form after closing
    setTimeout(() => {
        resetForm();
    }, 300);
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('registrationModal');
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeRegistrationForm();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeRegistrationForm();
        }
    });
});

// ==========================================
// RESET FORM
// ==========================================
function resetForm() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    
    // Reset to step 1
    currentStep = 1;
    showStep(currentStep);
    
    // Reset form fields
    form.reset();
    
    // Clear error messages
    clearAllErrors();
    
    // Hide success message
    successMessage.classList.remove('active');
    
    // Clear file names
    document.getElementById('passportFileName').textContent = '';
    document.getElementById('personalPhotoName').textContent = '';
    document.getElementById('certificateName').textContent = '';
}

// ==========================================
// SHOW STEP
// ==========================================
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update progress indicator
    updateProgress(step);
}

// ==========================================
// UPDATE PROGRESS
// ==========================================
function updateProgress(step) {
    document.querySelectorAll('.progress-step').forEach(progressStep => {
        const stepNumber = parseInt(progressStep.dataset.step);
        
        if (stepNumber < step) {
            progressStep.classList.add('completed');
            progressStep.classList.remove('active');
        } else if (stepNumber === step) {
            progressStep.classList.add('active');
            progressStep.classList.remove('completed');
        } else {
            progressStep.classList.remove('active', 'completed');
        }
    });
}

// ==========================================
// NEXT STEP
// ==========================================
function nextStep() {
    // Validate current step
    if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
        
        // Scroll to top of modal
        document.querySelector('.modal-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ==========================================
// PREVIOUS STEP
// ==========================================
function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        
        // Scroll to top of modal
        document.querySelector('.modal-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ==========================================
// VALIDATE STEP
// ==========================================
function validateStep(step) {
    clearAllErrors();
    let isValid = true;
    
    if (step === 1) {
        // Validate Full Name
        const fullName = document.getElementById('fullName');
        if (!fullName.value.trim()) {
            showError('fullNameError', 'الرجاء إدخال الاسم الكامل');
            fullName.classList.add('error');
            isValid = false;
        } else if (fullName.value.trim().length < 3) {
            showError('fullNameError', 'الاسم يجب أن يكون 3 أحرف على الأقل');
            fullName.classList.add('error');
            isValid = false;
        }
        
        // Validate Nationality
        const nationality = document.getElementById('nationality');
        if (!nationality.value) {
            showError('nationalityError', 'الرجاء اختيار الجنسية');
            nationality.classList.add('error');
            isValid = false;
        }
        
        // Validate Residence
        const residence = document.getElementById('residence');
        if (!residence.value.trim()) {
            showError('residenceError', 'الرجاء إدخال بلد الإقامة');
            residence.classList.add('error');
            isValid = false;
        }
        
        // Validate Study Duration
        const studyDuration = document.getElementById('studyDuration');
        if (!studyDuration.value) {
            showError('studyDurationError', 'الرجاء اختيار مدة الدراسة');
            studyDuration.classList.add('error');
            isValid = false;
        }
        
        // Validate Email
        const email = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError('emailError', 'الرجاء إدخال البريد الإلكتروني');
            email.classList.add('error');
            isValid = false;
        } else if (!emailPattern.test(email.value)) {
            showError('emailError', 'البريد الإلكتروني غير صحيح');
            email.classList.add('error');
            isValid = false;
        }
        
        // Validate Phone Number
        const phoneNumber = document.getElementById('phoneNumber');
        const phonePattern = /^[0-9]{7,15}$/;
        if (!phoneNumber.value.trim()) {
            showError('phoneError', 'الرجاء إدخال رقم الجوال');
            phoneNumber.classList.add('error');
            isValid = false;
        } else if (!phonePattern.test(phoneNumber.value)) {
            showError('phoneError', 'رقم الجوال غير صحيح (7-15 رقم)');
            phoneNumber.classList.add('error');
            isValid = false;
        }
    }
    
    if (step === 2) {
        // Validate Passport Photo
        const passportPhoto = document.getElementById('passportPhoto');
        if (!passportPhoto.files.length) {
            showError('passportPhotoError', 'الرجاء رفع صورة الجواز');
            isValid = false;
        } else {
            // Validate file size (max 5MB)
            if (passportPhoto.files[0].size > 5 * 1024 * 1024) {
                showError('passportPhotoError', 'حجم الملف كبير جداً (الحد الأقصى 5MB)');
                isValid = false;
            }
        }
        
        // Validate Personal Photo
        const personalPhoto = document.getElementById('personalPhoto');
        if (!personalPhoto.files.length) {
            showError('personalPhotoError', 'الرجاء رفع الصورة الشخصية');
            isValid = false;
        } else {
            // Validate file size (max 5MB)
            if (personalPhoto.files[0].size > 5 * 1024 * 1024) {
                showError('personalPhotoError', 'حجم الملف كبير جداً (الحد الأقصى 5MB)');
                isValid = false;
            }
        }
        
        // Validate Certificate
        const certificate = document.getElementById('certificate');
        if (!certificate.files.length) {
            showError('certificateError', 'الرجاء رفع الشهادة');
            isValid = false;
        } else {
            // Validate file size (max 5MB)
            if (certificate.files[0].size > 5 * 1024 * 1024) {
                showError('certificateError', 'حجم الملف كبير جداً (الحد الأقصى 5MB)');
                isValid = false;
            }
        }
        
        // Validate Terms
        const termsAccept = document.getElementById('termsAccept');
        if (!termsAccept.checked) {
            showError('termsError', 'يجب الموافقة على الشروط والأحكام');
            isValid = false;
        }
    }
    
    return isValid;
}

// ==========================================
// SHOW ERROR
// ==========================================
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
}

// ==========================================
// CLEAR ALL ERRORS
// ==========================================
function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('active');
        error.textContent = '';
    });
    
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.classList.remove('error');
    });
}

// ==========================================
// FILE INPUT HANDLING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Passport Photo
    const passportPhoto = document.getElementById('passportPhoto');
    passportPhoto.addEventListener('change', (e) => {
        const fileName = e.target.files.length > 0 ? e.target.files[0].name : '';
        document.getElementById('passportFileName').textContent = fileName;
    });
    
    // Personal Photo
    const personalPhoto = document.getElementById('personalPhoto');
    personalPhoto.addEventListener('change', (e) => {
        const fileName = e.target.files.length > 0 ? e.target.files[0].name : '';
        document.getElementById('personalPhotoName').textContent = fileName;
    });
    
    // Certificate
    const certificate = document.getElementById('certificate');
    certificate.addEventListener('change', (e) => {
        const fileName = e.target.files.length > 0 ? e.target.files[0].name : '';
        document.getElementById('certificateName').textContent = fileName;
    });
});

// ==========================================
// FORM SUBMISSION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate step 2
        if (!validateStep(2)) {
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        
        // ==========================================
        // DJANGO INTEGRATION POINT
        // ==========================================
        // Replace this section with actual Django form submission
        // Example:
        /*
        try {
            const response = await fetch('{% url "submit_application" %}', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': '{{ csrf_token }}'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                showSuccessMessage(data.student_name, data.email);
            } else {
                alert('حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.');
        }
        */
        // ==========================================
        
        // DEMO: Simulate form submission
        setTimeout(() => {
            const studentName = formData.get('full_name');
            const email = formData.get('email');
            
            // Show success message
            showSuccessMessage(studentName, email);
            
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Log form data (for development only)
            console.log('Form submitted with data:');
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: ${value.name} (${value.size} bytes)`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }
        }, 1500);
    });
});

// ==========================================
// SHOW SUCCESS MESSAGE
// ==========================================
function showSuccessMessage(studentName, email) {
    // Hide form steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Hide progress indicator
    document.querySelector('.form-progress').style.display = 'none';
    
    // Set success message content
    document.getElementById('successName').textContent = studentName;
    document.getElementById('successEmail').textContent = email;
    
    // Show success message
    document.getElementById('successMessage').classList.add('active');
    
    // Scroll to top
    document.querySelector('.modal-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================
// REAL-TIME VALIDATION (Optional Enhancement)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Remove error on input
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorId = input.id + 'Error';
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.classList.remove('active');
            }
        });
    });
});
