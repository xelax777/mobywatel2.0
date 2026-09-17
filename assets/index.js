var selector = document.querySelector(".selector_box");
if (selector) {
    selector.addEventListener('click', () => {
        if (selector.classList.contains("selector_open")){
            selector.classList.remove("selector_open")
        }else{
            selector.classList.add("selector_open")
        }
    })
}

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown")
    })
})

var sex = "m"

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    })
})

var upload = document.querySelector(".upload");
var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    if (input) {
        input.addEventListener('click', () => {
            element.classList.remove("error_shown");
        })
    }
});

if (upload) {
    upload.addEventListener('click', () => {
        imageInput.click();
        upload.classList.remove("error_shown")
    });
}

// =========================================================================
// UNIVERSAL & ROBUST PHOTO LOADER (NO MORE INFINITE LOADING)
// =========================================================================
imageInput.addEventListener('change', (event) => {
    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    var file = imageInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var localUrl = e.target.result;
            
            // 1. Save strictly to local storage so all subpages can access it
            localStorage.setItem("mo_saved_image", localUrl);

            // 2. Clear out errors and mark as loaded
            upload.classList.remove("error_shown");
            upload.setAttribute("selected", localUrl); 
            upload.classList.add("upload_loaded");
            upload.classList.remove("upload_loading");
            
            // 3. Find the preview image container and FORCE show the picture
            var uploadedImg = upload.querySelector(".upload_uploaded") || upload.querySelector("img");
            if (uploadedImg) {
                uploadedImg.src = localUrl;
                uploadedImg.style.display = 'block';
                uploadedImg.style.position = 'absolute';
                uploadedImg.style.top = '0';
                uploadedImg.style.left = '0';
                uploadedImg.style.width = '100%';
                uploadedImg.style.height = '100%';
                uploadedImg.style.objectFit = 'cover';
                uploadedImg.style.zIndex = '10';
            }
            
            // 4. Hide the text prompt so it doesn't overlap
            var textPrompt = upload.querySelector(".upload_grid");
            if (textPrompt) textPrompt.style.opacity = '0';
        };
        reader.readAsDataURL(file);
    }
});

// Submit Button Logic
document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();

    params.set("sex", sex)
    if (!upload.hasAttribute("selected")){
        empty.push(upload);
        upload.classList.add("error_shown")
    }else {
        params.set("image", "local")
    }

    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday = birthday + "." + element.value
        if (isEmpty(element.value)){
            dateEmpty = true;
        }
    })

    birthday = birthday.substring(1);

    if (dateEmpty){
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    }else{
        params.set("birthday", birthday)
        localStorage.setItem("mo_saved_birthday", birthday);
    }

    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        if (input) {
            if (isEmpty(input.value)){
                empty.push(element);
                element.classList.add("error_shown");
            }else{
                params.set(input.id, input.value)
                localStorage.setItem("mo_saved_" + input.id, input.value);
            }
        }
    })

    localStorage.setItem("mo_saved_sex", sex);

    if (empty.length != 0){
        empty[0].scrollIntoView();
    }else{
        forwardToId(params);
    }
});

function isEmpty(value){
    let pattern = /^\s*$/
    return pattern.test(value);
}

function forwardToId(params){
    location.href = "id.html?" + params.toString();
}

var guide = document.querySelector(".guide_holder");
if (guide) {
    guide.addEventListener('click', () => {
        if (guide.classList.contains("unfolded")){
            guide.classList.remove("unfolded");
        }else{
            guide.classList.add("unfolded");
        }
    })
}
