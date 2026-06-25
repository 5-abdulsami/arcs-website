/**
 * Apex Institute of Technology - Main Javascript File
 * Handles dynamic interactions, navigation behaviors, scroll observers, 
 * gallery filters, interactive lightbox, and form submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // STICKY HEADER & BACK-TO-TOP BUTTON
    // ==========================================================================
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('back-to-top');
    
    const handleScrollEffects = () => {
        const scrollPos = window.scrollY;
        
        // Sticky Header class toggler
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to Top visibility
        if (scrollPos > 600) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };
    
    window.addEventListener('scroll', handleScrollEffects);
    
    // Back to top click action
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================================================
    // MOBILE NAVIGATION MENU
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    const toggleMobileMenu = () => {
        menuToggle.classList.toggle('open');
        mobileOverlay.classList.toggle('open');
        document.body.classList.toggle('no-scroll'); // Prevent body scroll when menu is open
    };
    
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close overlay menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileOverlay.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // ==========================================================================
    // ACTIVE NAVIGATION LINKS HIGHLIGHTING (IntersectionObserver)
    // ==========================================================================
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const navObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Highlights as the section takes up the middle of the viewport
        threshold: 0
    };
    
    const navObserverCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };
    
    const navObserver = new IntersectionObserver(navObserverCallback, navObserverOptions);
    sections.forEach(section => {
        if (section.getAttribute('id')) {
            navObserver.observe(section);
        }
    });

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (IntersectionObserver)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserverOptions = {
        root: null,
        threshold: 0.12, // Element is revealed when 12% visible
        rootMargin: '0px'
    };
    
    const revealObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once revealed, no need to observe again
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealObserverCallback, revealObserverOptions);
    
    // Apply delay properties programmatically to child columns if needed
    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // CAMPUS PHOTO GALLERY FILTERING
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active status from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                // Apply a smooth scale transition fade-out/fade-in
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.transform = 'scale(0.8)';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.classList.remove('hidden');
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                            item.style.opacity = '1';
                        }, 50);
                    }, 300);
                } else {
                    item.style.transform = 'scale(0.8)';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // INTERACTIVE LIGHTBOX FOR GALLERY
    // ==========================================================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let activeGalleryArray = [];
    let currentImageIndex = 0;
    
    // Get visible gallery items
    const updateActiveGallery = () => {
        activeGalleryArray = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    };
    
    const openLightbox = (index) => {
        updateActiveGallery();
        currentImageIndex = index;
        const selectedItem = activeGalleryArray[currentImageIndex];
        const imgElement = selectedItem.querySelector('.gallery-img');
        const titleElement = selectedItem.querySelector('.gallery-title');
        
        lightboxImg.src = imgElement.src;
        lightboxImg.alt = imgElement.alt;
        lightboxCaption.textContent = titleElement.textContent;
        
        lightboxModal.classList.add('open');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    };
    
    const closeLightbox = () => {
        lightboxModal.classList.remove('open');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    };
    
    const showPrevImage = () => {
        if (currentImageIndex > 0) {
            openLightbox(currentImageIndex - 1);
        } else {
            openLightbox(activeGalleryArray.length - 1); // Loop to end
        }
    };
    
    const showNextImage = () => {
        if (currentImageIndex < activeGalleryArray.length - 1) {
            openLightbox(currentImageIndex + 1);
        } else {
            openLightbox(0); // Loop to start
        }
    };
    
    // Hook gallery item clicks
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Find current item's relative index among visible items
            updateActiveGallery();
            const visibleIndex = activeGalleryArray.indexOf(item);
            if (visibleIndex !== -1) {
                openLightbox(visibleIndex);
            }
        });
    });
    
    // Close button click
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Previous & Next controls
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
    
    // Close lightbox when clicking outside image content
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
    
    // Keyboard accessibility navigation
    document.addEventListener('keydown', (e) => {
        if (lightboxModal.classList.contains('open')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    // ==========================================================================
    // CONTACT FORM SUBMISSION & VALIDATION (SIMULATED)


    // ==========================================================================
    // NEWSLETTER FORM SUBMISSION (SIMULATED)
    // ==========================================================================
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input');
        const submitBtn = newsletterForm.querySelector('button');
        
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        
        setTimeout(() => {
            newsletterForm.reset();
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            
            newsletterSuccess.style.display = 'flex';
            newsletterSuccess.style.opacity = '1';
            
            // Fade out success notification
            setTimeout(() => {
                newsletterSuccess.style.opacity = '0';
                setTimeout(() => {
                    newsletterSuccess.style.display = 'none';
                }, 400);
            }, 3000);
        }, 800);
    });

    // ==========================================================================
    // ONLINE ADMISSION FORM SUBMISSION (SIMULATED)
    // ==========================================================================
    const onlineApplyForm = document.getElementById('online-apply-form');
    const applySuccess = document.getElementById('apply-success');
    
    if (onlineApplyForm) {
        onlineApplyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = onlineApplyForm.querySelector('.btn-apply-submit');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
            submitBtn.style.opacity = '0.7';
            
            // Collect form data
            const formData = {
                name: document.getElementById('apply-name').value,
                fatherName: document.getElementById('apply-father').value,
                phone: document.getElementById('apply-phone').value,
                email: document.getElementById('apply-email').value,
                marks: document.getElementById('apply-marks').value,
                program: document.getElementById('apply-program').value,
                date: new Date().toISOString()
            };
            
            // Submit to FormSubmit.co AJAX API to send real email to arcskhanpur@gmail.com
            fetch("https://formsubmit.co/ajax/arcskhanpur@gmail.com", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "Student Name": formData.name,
                    "Father's Name": formData.fatherName,
                    "WhatsApp / Phone": formData.phone,
                    "Email": formData.email || "Not Provided",
                    "Matric Marks / Percentage": formData.marks,
                    "Program of Interest": formData.program,
                    "_subject": `New Admission Application: ${formData.name}`,
                    "_captcha": "false",
                    "_template": "table"
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                // Save to localStorage as a backup
                const applications = JSON.parse(localStorage.getItem('admissions_applications') || '[]');
                applications.push(formData);
                localStorage.setItem('admissions_applications', JSON.stringify(applications));
                
                // Reset form
                onlineApplyForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.opacity = '1';
                
                // Show success toast
                applySuccess.style.display = 'flex';
                applySuccess.style.opacity = '1';
                
                // Scroll success toast into view smoothly
                applySuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Fade out success notification
                setTimeout(() => {
                    applySuccess.style.opacity = '0';
                    setTimeout(() => {
                        applySuccess.style.display = 'none';
                    }, 400);
                }, 5000);
            })
            .catch(error => {
                console.error("FormSubmit Error:", error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.opacity = '1';
                alert("An error occurred while submitting your application. Please check your network connection and try again.");
            });
        });
    }
});
