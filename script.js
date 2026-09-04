const riftboundPlayButton = document.getElementById("riftbound-play");
const riftboundMedia = document.getElementById("riftbound-media");

riftboundPlayButton.addEventListener("click", () => {
    const iframe = document.createElement("iframe");

    iframe.src = "projects/riftbound/RIFTBOUND.html";
    iframe.title = "Riftbound";
    iframe.allow = "autoplay; fullscreen";
    iframe.allowFullscreen = true;

    iframe.classList.add("riftbound-game");

    riftboundMedia.replaceChildren(iframe);
});