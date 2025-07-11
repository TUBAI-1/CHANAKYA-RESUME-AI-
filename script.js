document.addEventListener('DOMContentLoaded', () => {
    const templates = [
        { id: 'free1', name: 'Modern Professional', type: 'free', image: 'images/template1.png' },
        { id: 'free1', name: 'Executive Elegance', type: 'free', image: 'images/template2.png' },
        { id: 'free2', name: 'Creative Minimalist', type: 'free', image: 'images/template3.png' },
        { id: 'free2', name: 'Classic Corporate', type: 'free', image: 'images/template4.png' }
    ];

    const templateGrid = document.getElementById('template-grid');

    templates.forEach(template => {
        const card = document.createElement('div');
        card.classList.add('template-card');
        card.innerHTML = `
            <img src="${template.image}" alt="${template.name}">
            <h3>${template.name}</h3>
            <p class="price">Free</p>
            <button data-template-id="${template.id}">Use Template</button>
        `;
        templateGrid.appendChild(card);
    });

    templateGrid.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const templateId = event.target.dataset.templateId;
            const selectedTemplate = templates.find(t => t.id === templateId);

            if (selectedTemplate.type === 'free') {
                window.location.href = `form.html?template=${templateId}`;
            }
        }
    });

});