/*

  Tooplate 2164 Compass
  https://www.tooplate.com/view/2164-compass
  Free HTML CSS Template

*/

/* ================================================
   SCROLL REVEAL — IntersectionObserver
   ================================================ */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* setTimeout fallback for iframe preview contexts */
setTimeout(() => {
    revealElements.forEach(el => el.classList.add('visible'));
}, 3000);

/* ================================================
   ROUTE — Crossfade background images per chapter
   ================================================ */
const routeSlides = document.querySelectorAll('.route-bg img');
const chapters = document.querySelectorAll('.chapter[data-chapter]');

const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.chapter, 10);
            routeSlides.forEach(slide => slide.classList.remove('active'));
            if (routeSlides[idx]) {
                routeSlides[idx].classList.add('active');
            }
        }
    });
}, {
    threshold: 0.4,
    rootMargin: '-10% 0px -10% 0px'
});

chapters.forEach(ch => chapterObserver.observe(ch));

/* ================================================
   GALLERY — Full-size image lightbox
   ================================================ */
const imageLightbox = document.querySelector('.image-lightbox');

if (imageLightbox) {
    const lightboxImage = imageLightbox.querySelector('.image-lightbox-image');
    const lightboxCaption = imageLightbox.querySelector('.image-lightbox-caption');
    const lightboxClose = imageLightbox.querySelector('.image-lightbox-close');
    const lightboxPrevious = imageLightbox.querySelector('.image-lightbox-prev');
    const lightboxNext = imageLightbox.querySelector('.image-lightbox-next');
    const galleryPreviews = Array.from(document.querySelectorAll('.gallery .gallery-preview'));
    let activeGalleryIndex = 0;
    let isTransitioning = false;
    let finishExit = null;
    let finishEnter = null;

    const clearImageTransition = () => {
        if (finishExit) {
            lightboxImage.removeEventListener('animationend', finishExit);
            finishExit = null;
        }
        if (finishEnter) {
            lightboxImage.removeEventListener('animationend', finishEnter);
            finishEnter = null;
        }
        lightboxImage.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
        isTransitioning = false;
    };

    const setGalleryImage = index => {
        const button = galleryPreviews[index];
        const previewImage = button.querySelector('img');
        const caption = button.closest('.gallery-item').querySelector('.gallery-caption-title');

        lightboxImage.src = previewImage.src;
        lightboxImage.alt = previewImage.alt;
        lightboxCaption.textContent = caption.textContent.trim();
    };

    const showGalleryImage = index => {
        clearImageTransition();
        activeGalleryIndex = index;
        setGalleryImage(index);
    };

    const moveGalleryImage = direction => {
        if (isTransitioning) {
            return;
        }

        isTransitioning = true;
        const exitClass = direction > 0 ? 'slide-out-left' : 'slide-out-right';
        const enterClass = direction > 0 ? 'slide-in-right' : 'slide-in-left';
        const exitAnimation = direction > 0 ? 'lightbox-out-left' : 'lightbox-out-right';
        const enterAnimation = direction > 0 ? 'lightbox-in-right' : 'lightbox-in-left';

        finishExit = event => {
            if (event.animationName !== exitAnimation) {
                return;
            }
            lightboxImage.removeEventListener('animationend', finishExit);
            finishExit = null;
            lightboxImage.classList.remove(exitClass);
            activeGalleryIndex = (activeGalleryIndex + direction + galleryPreviews.length) % galleryPreviews.length;
            setGalleryImage(activeGalleryIndex);

            finishEnter = event => {
                if (event.animationName !== enterAnimation) {
                    return;
                }
                lightboxImage.removeEventListener('animationend', finishEnter);
                finishEnter = null;
                lightboxImage.classList.remove(enterClass);
                isTransitioning = false;
            };
            lightboxImage.addEventListener('animationend', finishEnter);
            lightboxImage.classList.add(enterClass);
        };
        lightboxImage.addEventListener('animationend', finishExit);
        lightboxImage.classList.add(exitClass);
    };

    galleryPreviews.forEach((button, index) => {
        button.addEventListener('click', () => {
            showGalleryImage(index);
            imageLightbox.showModal();
        });
    });

    lightboxClose.addEventListener('click', () => imageLightbox.close());
    lightboxPrevious.addEventListener('click', () => moveGalleryImage(-1));
    lightboxNext.addEventListener('click', () => moveGalleryImage(1));
    imageLightbox.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveGalleryImage(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveGalleryImage(1);
        }
    });
    imageLightbox.addEventListener('close', clearImageTransition);
    imageLightbox.addEventListener('click', event => {
        if (event.target === imageLightbox) {
            imageLightbox.close();
        }
    });
}

/* ================================================
   MOBILE NAV TOGGLE
   ================================================ */
const toggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.nav-links--mobile');
const closeBtn = document.querySelector('.nav-close');
const navBar = document.querySelector('.nav-bar');

toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.classList.toggle('menu-open');
});

closeBtn.addEventListener('click', () => {
    toggle.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.classList.remove('menu-open');
});

mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.classList.remove('menu-open');
    });
});

/* ================================================
   NAV — Semi-transparent BG on scroll
   ================================================ */
const handleNavScroll = () => {
    if (window.scrollY > 80) {
        navBar.classList.add('scrolled');
    } else {
        navBar.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();
