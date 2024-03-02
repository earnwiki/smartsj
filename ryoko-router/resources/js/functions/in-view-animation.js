export default function () {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    });

    document.querySelectorAll('.in-view-animation').forEach(element => {
        if (element) {
            observer.observe(element);
        }
    });
}
