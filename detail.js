document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('applicationForm');
    const statusTracker = document.getElementById('statusTracker');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const uploadBtn = document.getElementById('uploadBtn');
    const resumeUpload = document.getElementById('resumeUpload');
    const fileInfo = document.getElementById('fileInfo');
    const applyBtn = document.getElementById('applyBtn');
    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const emailError = document.getElementById('emailError');
    const fileError = document.getElementById('fileError');
    const applicationDate = document.getElementById('applicationDate');

    const stages = ['applied', 'interview', 'offering'];
    let currentFile = null;

    // Load saved status
    const savedStatus = localStorage.getItem('applicationStatus');
    const savedDate = localStorage.getItem('applicationDate');
    if (savedStatus) {
        form.classList.add('hidden');
        statusTracker.classList.remove('hidden');
        updateStatusTracker(savedStatus);
        applicationDate.textContent = savedDate;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateFile(file) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            return 'File size must be less than 2MB';
        }
        if (!file.type.includes('pdf')) {
            return 'Only PDF files are allowed';
        }
        return null;
    }

    function updateApplyButton() {
        const isValid = fullNameInput.value &&
            validateEmail(emailInput.value) &&
            currentFile &&
            !emailError.textContent &&
            !fileError.textContent;
        applyBtn.disabled = !isValid;
    }

    function updateStatusTracker(status) {
        const points = document.querySelectorAll('.status-point');
        points.forEach(point => {
            const pointStatus = point.dataset.status;
            point.classList.toggle('active', stages.indexOf(pointStatus) <= stages.indexOf(status));
        });

        if (status === 'applied') {
            backBtn.disabled = true;
            forwardBtn.disabled = false;
            forwardBtn.textContent = 'Forward';
        } else if (status === 'interview') {
            backBtn.disabled = false;
            forwardBtn.disabled = false;
            forwardBtn.textContent = 'Forward';
        } else if (status === 'offering') {
            backBtn.style.display = 'none';
            forwardBtn.textContent = 'See Offering Letter';
        }
    }

    uploadBtn.addEventListener('click', () => {
        resumeUpload.click();
    });

    resumeUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const error = validateFile(file);
            if (error) {
                fileError.textContent = error;
                fileInfo.textContent = '';
                currentFile = null;
            } else {
                fileError.textContent = '';
                fileInfo.innerHTML = `
                    ${file.name}
                    <span class="remove-file">×</span>
                `;
                currentFile = file;
            }
            updateApplyButton();
        }
    });

    fileInfo.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-file')) {
            fileInfo.textContent = '';
            resumeUpload.value = '';
            currentFile = null;
            updateApplyButton();
        }
    });

    emailInput.addEventListener('input', () => {
        const isValid = validateEmail(emailInput.value);
        emailError.textContent = isValid ? '' : 'Invalid email format';
        updateApplyButton();
    });

    fullNameInput.addEventListener('input', updateApplyButton);

    applyBtn.addEventListener('click', () => {
        const date = new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        localStorage.setItem('applicationStatus', 'applied');
        localStorage.setItem('applicationDate', date);
        form.classList.add('hidden');
        statusTracker.classList.remove('hidden');
        applicationDate.textContent = date;
        updateStatusTracker('applied');
    });

    backBtn.addEventListener('click', () => {
        const currentIndex = stages.indexOf(localStorage.getItem('applicationStatus'));
        const newStatus = stages[currentIndex - 1];
        localStorage.setItem('applicationStatus', newStatus);
        updateStatusTracker(newStatus);
    });

    forwardBtn.addEventListener('click', () => {
        const currentStatus = localStorage.getItem('applicationStatus');
        if (currentStatus === 'offering') {
            // Handle offering letter view
            return;
        }
        const currentIndex = stages.indexOf(currentStatus);
        const newStatus = stages[currentIndex + 1];
        localStorage.setItem('applicationStatus', newStatus);
        updateStatusTracker(newStatus);
    });
});