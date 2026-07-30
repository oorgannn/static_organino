(() => {
    const initializeSite = () => {
        const header = document.getElementById("header");

        if (header) {
            const updateHeader = () => {
                header.classList.toggle("scrolled", window.scrollY > 50);
            };

            updateHeader();
            window.addEventListener("scroll", updateHeader, { passive: true });
        }

        const mobileMenu = document.querySelector(".site-menu");

        if (mobileMenu) {
            mobileMenu.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => {
                    mobileMenu.removeAttribute("open");
                });
            });

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    mobileMenu.removeAttribute("open");
                }
            });
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeSite, { once: true });
    } else {
        initializeSite();
    }
})();
