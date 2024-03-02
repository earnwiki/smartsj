export default function () {
    bindClickEvents();
    bindScrollEvents();
}

function bindClickEvents() {
    const elements = document.querySelectorAll('[data-ga-click]');

    elements.forEach((element) => {
        element.addEventListener('click', (event) => {
            typeof gatag !== 'undefined' && gatag('event', 'Click', { 'event_category': element.dataset.gaCategory, 'event_label': element.dataset.gaClick });
        });
    });
}

function bindScrollEvents()
{
    function handleIntersection(entries, observer) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.dataset.gaSection;
                typeof gatag !== 'undefined' && gatag('event', 'Scroll', { 'event_category': 'Section', 'event_label': sectionId });
                observer.unobserve(entry.target);
            }
        });
    }

    let observer = new IntersectionObserver(handleIntersection);
    document.querySelectorAll('[data-ga-section]').forEach((section) => {
        observer.observe(section);
    });
}
