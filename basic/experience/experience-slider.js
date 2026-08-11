function initExperienceAnimation() {
    const experienceBody = document.querySelector(".experience-body");
    const map = document.querySelector(".map");
    const mapDivs = document.querySelectorAll(".map > div");
    const sectionDivs = document.querySelectorAll(".sections > .sec");

    if (
        !experienceBody ||
        !map ||
        !mapDivs.length ||
        !sectionDivs.length
    ) {
        return;
    }

    let lastActiveIndex = -1;

    // -----------------------------------------
    // Update active map item
    // -----------------------------------------
    function updateActiveMap() {
        const viewportPosition = window.innerHeight * 0.35;

        let activeIndex = 0;

        sectionDivs.forEach((section, index) => {
            const rect = section.getBoundingClientRect();

            if (rect.top <= viewportPosition) {
                activeIndex = index;
            }
        });

        if (activeIndex === lastActiveIndex) {
            return;
        }

        // Remove active state from all map items
        mapDivs.forEach((item) => {
            item.classList.remove("active");
            item.style.height = "";
        });

        // Activate current map item
        const activeMapItem = mapDivs[activeIndex];

        if (activeMapItem) {
            activeMapItem.classList.add("active");

            const sectionHeight =
                sectionDivs[activeIndex].offsetHeight;

            activeMapItem.style.height =
                `${sectionHeight * 0.5}px`;
        }

        lastActiveIndex = activeIndex;
    }

    // -----------------------------------------
    // Click map item to scroll to experience
    // -----------------------------------------
    mapDivs.forEach((mapItem, index) => {
        mapItem.addEventListener("click", () => {
            const targetSection = sectionDivs[index];

            if (!targetSection) {
                return;
            }

            const headerOffset = 100;

            const targetPosition =
                targetSection.getBoundingClientRect().top +
                window.scrollY -
                headerOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });

        // Make the map item keyboard accessible
        mapItem.setAttribute("role", "button");
        mapItem.setAttribute("tabindex", "0");

        mapItem.addEventListener("keydown", (event) => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                mapItem.click();
            }
        });
    });

    // -----------------------------------------
    // Handle scrolling
    // -----------------------------------------
    function handleScroll() {
        const experienceRect =
            experienceBody.getBoundingClientRect();

        const experienceTop = experienceRect.top;
        const experienceBottom = experienceRect.bottom;

        /*
         * Only update the map while the Experience
         * section is visible.
         */
        if (
            experienceBottom > 0 &&
            experienceTop < window.innerHeight
        ) {
            updateActiveMap();
        }
    }

    // -----------------------------------------
    // Initial state
    // -----------------------------------------
    updateActiveMap();

    // -----------------------------------------
    // Scroll listener
    // -----------------------------------------
    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    // -----------------------------------------
    // Resize listener
    // -----------------------------------------
    window.addEventListener("resize", updateActiveMap);
}


// Initialize when DOM is ready
document.addEventListener(
    "DOMContentLoaded",
    initExperienceAnimation
);