'use strict';

window.addEventListener('DOMContentLoaded', () => {
    // Global vars

    const overlay = document.querySelector('.overlay'),
          body = document.querySelector('body'),
          scrollBarWidth = window.innerWidth - document.documentElement.clientWidth,
          message = {
            loading: 'Завантаження...',
            success: "Дякую! Скоро ми з вами зв'яжемося",
            failure: 'Щось пішло не так...',
            spinner: 'assets/img/spinner.gif',
            ok: 'assets/img/ok.png',
            fail: 'assets/img/fail.png'
        };
    
    // Smooth scroll to section

    function smoothScroll(linksSelector, navSelector) {
        document.querySelectorAll(linksSelector).forEach(link => {

            link.addEventListener('click', function(e) {
                e.preventDefault();
        
                if (window.innerWidth < 769) {
                    window.onscroll = () => false;
                    body.style.marginRight = `0`;
                    body.classList.add('disableScroll');
                    overlay.classList.remove('fadeIn');
                    overlay.childNodes.forEach(child => child.classList.remove('fadeIn'));
                };

                link.style.color = '#fff';

                let href = this.getAttribute('href').substring(1);
        
                const scrollTarget = document.querySelector(`.${href}`);
        
                const topOffset = document.querySelector(navSelector).offsetHeight;
                const elementPosition = scrollTarget.getBoundingClientRect().top;
                const offsetPosition = elementPosition - topOffset;
        
                window.scrollBy({
                    top: window.innerWidth < 769 ? offsetPosition + 200 : offsetPosition + 50,
                    behavior: 'smooth'
                });
            });
        });
    }

    smoothScroll('.main__item', '.main__nav');
    smoothScroll('.small__item', '.small__wrapper');

    // Make close btn and overlay

    const closeBtns = document.querySelectorAll('.close');

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            body.style.marginRight = `0`;
            body.classList.remove('disableScroll');
            overlay.classList.remove('fadeIn');
            overlay.childNodes.forEach(child => {
                child.style.display = 'none';
                child.classList.remove('fadeIn');
            });
        });
    });

    if (window.innerWidth > 768) {
        overlay.addEventListener('click', (e) => {
            if (e.target == overlay) {
                body.style.marginRight = `0`;
                body.classList.remove('disableScroll');
                overlay.classList.remove('fadeIn');
                overlay.childNodes.forEach(child => {
                    child.style.display = 'none';
                    child.classList.remove('fadeIn');
                });
            };
        });
    };

    // Function to open modal with btn

    function openModal() {
        const btns = document.querySelectorAll('.btn'),
              overlayItems = [...overlay.childNodes];

        btns.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');

                body.style.marginRight = `${scrollBarWidth}px`;
                body.classList.add('disableScroll');
                overlayItems.forEach(item => item.style.display = 'none');
                overlayItems.filter(item => item.id == id)[0].style.display = 'block';
                overlay.classList.add('fadeIn');
                document.querySelector(`#${id}`).classList.add('fadeIn');
            });
        });
    };

    openModal();

    // Slider

    function sliderClass(sliderSelector, sliderWrapperSelector, nextSelector, prevSelector, width, slidesSelector) {
        let offset = 0;
        const slider = document.querySelector(sliderSelector),
            sliderWrapper = document.querySelector(sliderWrapperSelector),
            next = document.querySelector(nextSelector),
            prev = document.querySelector(prevSelector),
            slides = document.querySelectorAll(slidesSelector);
        
        slider.style.width = 100 * slides.length + '%';
        slider.style.display = 'flex';
        slider.style.transition = '0.65s all';
        sliderWrapper.style.overflow = 'hidden';

        slides.forEach(slides => {
            slides.style.width = width;
        });

        next.addEventListener('click', () => {
            if (offset == (+width.slice(0, width.length - 2) * (slides.length - 1))) {
                offset = 0;
            } else {
                offset += +width.slice(0, width.length - 2);
            }

            slider.style.transform = `translateX(-${offset}px)`;
        });

        prev.addEventListener('click', () => {
            if (offset == 0) {
                offset = +width.slice(0, width.length - 2) * (slides.length - 1);
            } else {
                offset -= +width.slice(0, width.length - 2);
            }

            slider.style.transform = `translateX(-${offset}px)`;
        });
    };

    sliderClass('.mark__slider', '.mark__wrapper', '.mark__btn-right', '.mark__btn-left', window.getComputedStyle(document.querySelector('.mark__wrapper')).width, '.mark__slide');

    // Send Form

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            body: data
        });
    
        return await res.text();
    };

    function clearInputs(inputs) {
        inputs.forEach(item => {
            item.value = '';
        });
    };

    function sendForm() {
        const form = document.querySelector('.modal__form'),
              inputs = document.querySelectorAll('input'),
              modal = document.querySelector('.modal');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('div');
            
            statusMessage.classList.add('statusMessage');
            modal.appendChild(statusMessage);

            modal.classList.remove('fadeIn');

            let textMessage = document.createElement('div'),
                statusImg = document.createElement('img');
                
            setTimeout(() => {
                modal.classList.add('fadeIn');
                form.style.display = 'none';

                statusImg.setAttribute('src', message.spinner);
                statusImg.classList.add('fadeIn');

                textMessage.textContent = message.loading;
                textMessage.classList.add('textMessage');

                statusMessage.classList.add('statusMessage');
                statusMessage.appendChild(statusImg);
                statusMessage.appendChild(textMessage);
            }, 400);

            const formData = new FormData(form);

            postData('./mailer/smart.php', formData)
                .then(res => {
                    modal.classList.remove('fadeIn');

                    setTimeout(() => {
                        if (res.length > 1) {
                            statusImg.setAttribute('src', message.fail);
    
                            textMessage.textContent = message.failure;
                            textMessage.classList.add('fadeIn', 'failText');
    
                            statusMessage.classList.add('fadeIn');
                            statusMessage.classList.add('statusMessage');
                        } else {
                            modal.classList.add('fadeIn');
                            statusImg.setAttribute('src', message.ok);
    
                            statusMessage.classList.add('fadeIn');
                            statusMessage.classList.add('statusMessage');
    
                            textMessage.textContent = message.success;
                            textMessage.classList.add('fadeIn', 'textMessage');
                        }
                    }, 400);
                })
                .catch(() => {
                    setTimeout(() => {
                        statusImg.remove();

                        textMessage.textContent = message.failure;
                        textMessage.classList.add('fadeIn', 'failText');

                        statusMessage.classList.add('fadeIn');
                        statusMessage.classList.add('statusMessage');
                    }, 400);
                })
                .finally(() => {
                    setTimeout(() => {
                        modal.classList.remove('fadeIn');
                        setTimeout(() => {
                            statusMessage.remove();
                            clearInputs(inputs);
                        }, 400);
                        setTimeout(() => {
                            modal.classList.add('fadeIn');
                            form.style.display = 'flex';
                            form.classList.add('fadeIn');
                        }, 400);
                    }, 5000);
                });
        });
    };

    sendForm();
});