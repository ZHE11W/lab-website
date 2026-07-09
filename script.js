const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const carouselSlides = [...document.querySelectorAll("[data-carousel-slide]")];
const carouselDots = [...document.querySelectorAll("[data-carousel-dot]")];
const publicationVideoLinks = [...document.querySelectorAll(".publication-video-link")];
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxTriggers = [...document.querySelectorAll("[data-lightbox-src]")];
const newsPhotoCarousels = [...document.querySelectorAll("[data-news-carousel]")];
let carouselIndex = 0;
let carouselTimer;
let videoHighlightTimer;

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeNav() {
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function setActiveLink() {
  const currentPage = location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === currentPage);
  });
}

function showCarouselSlide(index) {
  if (!carouselSlides.length) return;
  carouselIndex = (index + carouselSlides.length) % carouselSlides.length;
  carouselSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === carouselIndex);
  });
  carouselDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === carouselIndex);
  });
}

function startCarousel() {
  if (carouselSlides.length < 2) return;
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    showCarouselSlide(carouselIndex + 1);
  }, 4200);
}

function highlightPublicationVideo(videoCard) {
  if (!videoCard) return;
  clearTimeout(videoHighlightTimer);
  document.querySelectorAll(".publication-video-card.is-highlighted").forEach((card) => {
    card.classList.remove("is-highlighted");
  });
  void videoCard.offsetWidth;
  videoCard.classList.add("is-highlighted");
  videoHighlightTimer = setTimeout(() => {
    videoCard.classList.remove("is-highlighted");
  }, 5600);
}

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = src;
  lightboxImage.alt = alt || "";
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.src = "";
  lightboxImage.alt = "";
  document.body.classList.remove("lightbox-open");
}

function setNewsPhoto(carousel, index) {
  const slides = [...carousel.querySelectorAll("[data-news-slide]")];
  const dots = [...carousel.querySelectorAll("[data-news-dot]")];
  if (!slides.length) return;
  const nextIndex = (index + slides.length) % slides.length;
  carousel.dataset.newsIndex = String(nextIndex);
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === nextIndex);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === nextIndex);
  });
}

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNav();
});

window.addEventListener("scroll", () => {
  setHeaderState();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) closeNav();
});

carouselDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showCarouselSlide(index);
    startCarousel();
  });
});

publicationVideoLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.hash.slice(1);
    const targetVideo = document.getElementById(targetId);
    if (!targetVideo) return;

    event.preventDefault();
    history.pushState(null, "", link.hash);
    targetVideo.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      highlightPublicationVideo(targetVideo);
    }, 520);
  });
});

if (location.hash) {
  highlightPublicationVideo(document.getElementById(location.hash.slice(1)));
}

lightboxTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (trigger.matches("[data-news-slide]:not(.is-active)")) return;
    const image = trigger.querySelector("img");
    openLightbox(trigger.dataset.lightboxSrc, image?.alt);
  });
});

newsPhotoCarousels.forEach((carousel) => {
  const slides = [...carousel.querySelectorAll("[data-news-slide]")];
  const dots = [...carousel.querySelectorAll("[data-news-dot]")];
  const previous = carousel.querySelector("[data-news-prev]");
  const next = carousel.querySelector("[data-news-next]");

  setNewsPhoto(carousel, 0);

  previous?.addEventListener("click", () => {
    setNewsPhoto(carousel, Number(carousel.dataset.newsIndex || 0) - 1);
  });

  next?.addEventListener("click", () => {
    setNewsPhoto(carousel, Number(carousel.dataset.newsIndex || 0) + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setNewsPhoto(carousel, index);
    });
  });

  if (slides.length < 2) {
    previous?.setAttribute("hidden", "");
    next?.setAttribute("hidden", "");
    carousel.querySelector(".news-photo-dots")?.setAttribute("hidden", "");
  }
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightboxClose?.addEventListener("click", closeLightbox);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
});

setHeaderState();
setActiveLink();
showCarouselSlide(0);
startCarousel();
