document.addEventListener('DOMContentLoaded', () => {
    const resumeForm = document.getElementById('resume-form');
    const resumePreview = document.getElementById('resume-preview');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const downloadImageBtn = document.getElementById('download-image');
    const addEducationBtn = document.getElementById('add-education');
    const addExperienceBtn = document.getElementById('add-experience');

    let educationCount = 1;
    let experienceCount = 1;

    addEducationBtn.addEventListener('click', () => {
        const educationFields = document.getElementById('education-fields');
        const newEducationEntry = document.createElement('div');
        newEducationEntry.classList.add('education-entry');
        newEducationEntry.innerHTML = `
            <div class="form-group">
                <label for="degree">Degree:</label>
                <input type="text" class="degree" name="education[${educationCount}][degree]">
            </div>
            <div class="form-group">
                <label for="university">University:</label>
                <input type="text" class="university" name="education[${educationCount}][university]">
            </div>
            <div class="form-group">
                <label for="grad-year">Graduation Year:</label>
                <input type="text" class="grad-year" name="education[${educationCount}][grad_year]">
            </div>
        `;
        educationFields.appendChild(newEducationEntry);
        educationCount++;
    });

    addExperienceBtn.addEventListener('click', () => {
        const experienceFields = document.getElementById('experience-fields');
        const newExperienceEntry = document.createElement('div');
        newExperienceEntry.classList.add('experience-entry');
        newExperienceEntry.innerHTML = `
            <div class="form-group">
                <label for="job-title">Job Title:</label>
                <input type="text" class="job-title" name="experience[${experienceCount}][job_title]">
            </div>
            <div class="form-group">
                <label for="company">Company:</label>
                <input type="text" class="company" name="experience[${experienceCount}][company]">
            </div>
            <div class="form-group">
                <label for="duration">Duration:</label>
                <input type="text" class="duration" name="experience[${experienceCount}][duration]">
            </div>
            <div class="form-group">
                <label for="responsibilities">Responsibilities:</label>
                <textarea class="responsibilities" name="experience[${experienceCount}][responsibilities]" rows="3"></textarea>
            </div>
        `;
        experienceFields.appendChild(newExperienceEntry);
        experienceCount++;
    });

    resumeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        generateResumePreview();
    });

    function generateResumePreview() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const linkedin = document.getElementById('linkedin').value;
        const summary = document.getElementById('summary').value;
        const skills = document.getElementById('skills').value.split(',').map(s => s.trim()).filter(s => s);

        const educationEntries = Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
            degree: entry.querySelector('.degree').value,
            university: entry.querySelector('.university').value,
            grad_year: entry.querySelector('.grad-year').value
        }));

        const experienceEntries = Array.from(document.querySelectorAll('.experience-entry')).map(entry => ({
            job_title: entry.querySelector('.job-title').value,
            company: entry.querySelector('.company').value,
            duration: entry.querySelector('.duration').value,
            responsibilities: entry.querySelector('.responsibilities').value
        }));

        let previewHtml = `
            <div class="resume-preview-content">
                <h2 class="resume-name">${name}</h2>
                <p class="resume-contact-info">${email} | ${phone} ${linkedin ? `| <a href="${linkedin}" target="_blank" class="resume-linkedin">LinkedIn</a>` : ''}</p>
                
                ${summary ? `
                <h3 class="resume-heading">Summary</h3>
                <p class="resume-paragraph">${summary}</p>
                ` : ''}

                ${educationEntries.some(e => e.degree || e.university || e.grad_year) ? `
                <h3 class="resume-heading">Education</h3>
                ${educationEntries.map(edu => `
                    <div class="resume-section-content">
                        <h3>${edu.degree}</h3>
                        <p>${edu.university} <span class="date-range">${edu.grad_year}</span></p>
                    </div>
                `).join('')}
                ` : ''}

                ${experienceEntries.some(e => e.job_title || e.company || e.duration || e.responsibilities) ? `
                <h3 class="resume-heading">Experience</h3>
                ${experienceEntries.map(exp => `
                    <div class="resume-section-content">
                        <h3>${exp.job_title}</h3>
                        <p>${exp.company} <span class="date-range">${exp.duration}</span></p>
                        <ul class="resume-responsibility">
                            ${exp.responsibilities.split('\n').filter(r => r.trim()).map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
                ` : ''}

                ${skills.length > 0 ? `
                <h3 class="resume-heading">Skills</h3>
                <p class="resume-paragraph">${skills.join(', ')}</p>
                ` : ''}
            </div>
        `}

        resumePreview.innerHTML = previewHtml;
    }

    downloadPdfBtn.addEventListener('click', () => {
        // Ensure jsPDF and html2canvas are available
        if (typeof window.jspdf === 'undefined' || typeof window.html2canvas === 'undefined') {
            console.error('Error: jsPDF or html2canvas libraries are not loaded.');
            alert('PDF generation libraries are not loaded. Please ensure all necessary scripts are loaded correctly.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        html2canvas(resumePreview, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save('resume.pdf');
        }).catch(error => { // Added error handling for html2canvas
            console.error('Error generating PDF from resume preview:', error);
            alert('Failed to generate PDF. Please try again. If the problem persists, the content might be too complex or large.');
        });
    });


    downloadImageBtn.addEventListener('click', () => {
        // Ensure html2canvas is available
        if (typeof window.html2canvas === 'undefined') {
            console.error('Error: html2canvas library is not loaded.');
            alert('Image generation library is not loaded. Please ensure all necessary scripts are loaded correctly.');
            return;
        }

        html2canvas(resumePreview, { scale: 2 }).then(canvas => {
            doc.save('resume.pdf');
        });
    });


    downloadImageBtn.addEventListener('click', () => {
        html2canvas(resumePreview).then(canvas => {
            const link = document.createElement('a');
            link.download = 'resume.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(error => { // Added error handling for html2canvas
            console.error('Error generating image from resume preview:', error);
            alert('Failed to generate image. Please try again. If the problem persists, the content might be too complex or large.');
        });
    });

    // Initial generation of preview if data exists (e.g., from session storage)
    generateResumePreview();
});