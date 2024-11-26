let slideIndex = 1;

function loadImages() {
    fetch('images.json')
        .then(response => response.json())
        .then(data => {
            const imageContainer = document.getElementById('rendering-slides');
            data.forEach(image => {
                imageContainer.innerHTML += `
                <div class="rendering-slide fade">
                    <img src="${image.path}" style="width:100%" loading="lazy">
                    <div class="text">${image.name}</div>
                </div>`;
            });
        showSlides(slideIndex);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

document.addEventListener('DOMContentLoaded', loadImages);

document.getElementById("prev-button").addEventListener("click", function() {
    plusSlides(-1);
});

document.getElementById("next-button").addEventListener("click", function() {
    plusSlides(1);
});

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName('rendering-slide');
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex - 1].style.display = 'block';
}
