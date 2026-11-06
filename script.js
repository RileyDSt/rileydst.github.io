/* =========================================
   PROJECT GRID EXPANSION
   ========================================= */

const projectCards = [...document.querySelectorAll(".project-card")];

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

const ANIMATION_DURATION = 450;
const SCROLL_DELAY = 200;

let scrollTimeout;
let animationTimeout;
let cardAnimations = [];
let isAnimating = false;

function scrollToProject(card) {
    const nav = document.querySelector(".top-bar");

    const navHeight = nav
        ? nav.getBoundingClientRect().height
        : 0;

    const rect = card.getBoundingClientRect();
    const availableHeight = window.innerHeight - navHeight;

    let targetScroll;

    if (rect.height <= availableHeight - 40) {
        targetScroll =
            window.scrollY +
            rect.top -
            navHeight -
            (availableHeight - rect.height) / 2;
    } else {
        targetScroll =
            window.scrollY + rect.top - navHeight - 20;
    }

    window.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: reducedMotion.matches ? "instant" : "smooth"
    });
}

// Keep the clicked card in its original row.
function setProjectOrder(activeCard = null) {
    projectCards.forEach((projectCard, index) => {
        projectCard.style.order = index;
    });

    if (!activeCard) return;

    // No reordering needed on mobile.
    if (window.matchMedia("(max-width: 650px)").matches) {
        return;
    }

    const index = projectCards.indexOf(activeCard);

    // Right-column cards need to come before their neighbor.
    if (index % 2 === 1) {
        activeCard.style.order = index - 1;
        projectCards[index - 1].style.order = index;
    }
}

function toggleProject(card) {
    // Stop previous position animations.
    cardAnimations.forEach(animation => animation.cancel());
    cardAnimations = [];

    clearTimeout(scrollTimeout);

    // Save each card's current position.
    const firstPositions = projectCards.map(projectCard =>
        projectCard.getBoundingClientRect()
    );

    const wasExpanded = card.classList.contains("expanded");

    // Collapse all cards.
    projectCards.forEach(projectCard => {
        projectCard.classList.remove("expanded");

        projectCard.querySelector(".project-toggle")
            .setAttribute("aria-expanded", "false");
    });

    // Expand the selected card unless it was already open.
    if (!wasExpanded) {
        setProjectOrder(card);

        card.classList.add("expanded");

        card.querySelector(".project-toggle")
            .setAttribute("aria-expanded", "true");
    } else {
        setProjectOrder();
    }

    // Get each card's new position.
    const lastPositions = projectCards.map(projectCard =>
        projectCard.getBoundingClientRect()
    );

    // Animate surrounding cards into place.
    if (!reducedMotion.matches) {
        projectCards.forEach((projectCard, index) => {
            const deltaX =
                firstPositions[index].left - lastPositions[index].left;

            const deltaY =
                firstPositions[index].top - lastPositions[index].top;

            if (deltaX === 0 && deltaY === 0) return;

            const animation = projectCard.animate(
                [
                    {
                        transform:
                            `translate(${deltaX}px, ${deltaY}px)`
                    },
                    {
                        transform: "translate(0, 0)"
                    }
                ],
                {
                    duration: ANIMATION_DURATION,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)"
                }
            );

            cardAnimations.push(animation);
        });
    }
}

// Restore the normal order on page load.
setProjectOrder();

projectCards.forEach(card => {
    const toggle = card.querySelector(".project-toggle");

    toggle.addEventListener("click", () => {
        toggleProject(card);
    });
});


/* =========================================
   RIFTBOUND PLAYABLE GAME
   ========================================= */

const riftboundPlayButton = document.getElementById("riftbound-play");
const riftboundMedia = document.getElementById("riftbound-media");

if (riftboundPlayButton && riftboundMedia) {
    riftboundPlayButton.addEventListener("click", () => {
        const iframe = document.createElement("iframe");

        iframe.src = "projects/riftbound/RIFTBOUND.html";
        iframe.title = "Riftbound";
        iframe.allow = "autoplay; fullscreen";
        iframe.allowFullscreen = true;

        iframe.classList.add("riftbound-game");

        riftboundMedia.replaceChildren(iframe);
    });
}
