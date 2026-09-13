var selector = document.querySelector(".selector_box");
if (selector) {
    selector.addEventListener('click', () => {
        if (selector.classList.contains("selector_open")){
            selector.classList.remove("selector_open");
        } else {
            selector.classList.add("selector_open");
        }
    });
}

// Czyszczenie błędów przy kliknięciu w datę
document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown");
    });
});

var sex = "m";

// Wybór płci i podmiana tekstu
document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    });
});

// Czyszczenie błędów przy kliknięciu w pola tekstowe
document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    if (input) {
        input.addEventListener('click', () => {
            element.classList.remove("error_shown");
        });
    }
});

// Rozwijanie instrukcji (iOS / Android)
var guide = document.querySelector(".guide_holder");
if (guide) {
    guide.addEventListener('click', () => {
        if (guide.classList.contains("unfolded")){
            guide.classList.remove("unfolded");
        } else {
            guide.classList.add("unfolded");
        }
    });
}

// Funkcja sprawdzająca czy pole jest puste (Wyrażenie regularne autora)
function isEmpty(value){
    let pattern = /^\s*$/;
    return pattern.test(value);
}


// =========================================================================
// NAPRAWIONY MECHANIZM DODAWANIA ZDJĘCIA (BEZ WYGASŁEGO SERWERA IMGUR)
// =========================================================================

var upload = document.querySelector(".upload");
var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

if (upload) {
    upload.addEventListener('click', () => {
        imageInput.click();
        upload.classList.remove("error_shown");
    });
}

imageInput.addEventListener('change', (event) => {
    // Włączamy oryginalną animację ładowania (kręcące się kółko)
    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    var file = imageInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var localUrl = e.target.result; // Błyskawiczny lokalny link do zdjęcia z pamięci
            
            // ZAPISUJEMY ZDJĘCIE W PAMIĘCI URZĄDZENIA (Żeby id.html, home.html i card.html miały do niego dostęp)
            localStorage.setItem("mo_saved_image", localUrl);

            // Wyłączamy kółko ładowania i pokazujemy zdjęcie (To naprawia Twój błąd!)
            upload.classList.remove("error_shown");
            upload.setAttribute("selected", "local_saved"); // Flaga dla walidatora przycisku "wejdź"
            upload.classList.add("upload_loaded");
            upload.classList.remove("upload_loading");
            
            // Wstrzykujemy zdjęcie w oryginalny kontener podglądu
            var uploadedImg = upload.querySelector(".upload_uploaded");
            if (uploadedImg) {
                uploadedImg.src = localUrl;
                uploadedImg.style.display = 'block';
                uploadedImg.style.width = '100%';
                uploadedImg.style.height = '100%';
                uploadedImg.style.objectFit = 'cover';
            }
        };
        reader.readAsDataURL(file);
    }
});


// =========================================================================
// WALIDACJA PRZYCISKU "WEJDŹ" I POPRAWIONE PRZEKIEROWANIE DO ID.HTML
// =========================================================================

document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();

    params.set("sex", sex);

    // Sprawdzanie czy dodano zdjęcie
    if (!upload.hasAttribute("selected")){
        empty.push(upload);
        upload.classList.add("error_shown");
    } else {
        // Zamiast linku z imgura, przekazujemy informację, że zdjęcie jest w pamięci lokalnej
        params.set("image", "local");
    }

    // Walidacja pól daty urodzenia
    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday = birthday + "." + element.value;
        if (isEmpty(element.value)){
            dateEmpty = true;
        }
    });

    birthday = birthday.substring(1);

    if (dateEmpty){
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    } else {
        params.set("birthday", birthday);
        localStorage.setItem("mo_saved_birthday", birthday); // Zapis do pamięci
    }

    // Walidacja wszystkich pozostałych pól tekstowych (Imię, Nazwisko, Adresy itp.)
    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        if (input) {
            if (isEmpty(input.value)){
                empty.push(element);
                element.classList.add("error_shown");
            } else {
                params.set(input.id, input.value);
                localStorage.setItem("mo_saved_" + input.id, input.value); // Dynamiczny zapis każdego pola do pamięci
            }
        }
    });

    localStorage.setItem("mo_saved_sex", sex);

    // Jeśli są puste pola - przewiń do pierwszego błędu. Jeśli nie - idź dalej!
    if (empty.length != 0){
        empty[0].scrollIntoView();
    } else {
        forwardToId(params);
    }
});

// NAPRAWIONA FUNKCJA PRZEKIEROWANIA (Dostosowana pod GitHub Pages)
function forwardToId(params){
    // Zmieniono z "/id?" na "id.html?" ponieważ tak nazywa się Twój plik w folderze
    location.href = "id.html?" + params.toString();
}
