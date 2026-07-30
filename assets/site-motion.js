import { animate } from "https://cdn.jsdelivr.net/npm/motion@12.42.2/mini/+esm";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
    const entranceSelectors = [
        ".hero > *",
        ".explore-section.active > *",
        ".picks-page-header",
        ".picks-page-container",
        ".blog-intro",
        ".language-intro",
        ".about-page",
        ".post-header",
        ".post-cover",
        ".post-body",
        ".blog-archive"
    ];

    const entranceTargets = [...document.querySelectorAll(entranceSelectors.join(","))]
        .filter((element) => {
            const style = window.getComputedStyle(element);
            return style.display !== "none" && style.visibility !== "hidden";
        })
        .slice(0, 12);

    entranceTargets.forEach((element, index) => {
        animate(
            element,
            {
                opacity: [0.01, 1],
                transform: ["translateY(10px)", "translateY(0px)"]
            },
            {
                duration: 0.42,
                delay: Math.min(index * 0.045, 0.22),
                ease: "ease-out"
            }
        );
    });

    const revealTargets = document.querySelectorAll(
        ".project-card, .pick-card, .post-list-item"
    );

    if ("IntersectionObserver" in window && revealTargets.length) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    animate(
                        entry.target,
                        {
                            opacity: [0.01, 1],
                            transform: ["translateY(12px)", "translateY(0px)"]
                        },
                        { duration: 0.38, ease: "ease-out" }
                    );
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12 }
        );

        revealTargets.forEach((element) => revealObserver.observe(element));
    }

    const mobileMenu = document.querySelector(".site-menu");

    mobileMenu?.addEventListener("toggle", () => {
        if (!mobileMenu.open) return;
        const menuPanel = mobileMenu.querySelector("nav");
        if (!menuPanel) return;

        animate(
            menuPanel,
            {
                opacity: [0.01, 1],
                transform: ["translateY(-6px) scale(0.98)", "translateY(0) scale(1)"]
            },
            { duration: 0.2, ease: "ease-out" }
        );
    });
}
