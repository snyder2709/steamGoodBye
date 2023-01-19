function  auth (){

const container = document.querySelector(".container-form"),
    pwShowHide = document.querySelectorAll(".showHidePw"),
    pwFields = document.querySelectorAll(".password"),
    signup = document.querySelector(".signup-link"),
    login = document.querySelector(".login-link"),
    regBtn = document.querySelector(".registration-btn");

//   js code to show/hide password and change icon
pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        pwFields.forEach(pwField => {
            if (pwField.type === "password") {
                pwField.type = "text";

                pwShowHide.forEach(icon => {
                    icon.classList.replace("uil-eye-slash", "uil-eye");
                })
            } else {
                pwField.type = "password";

                pwShowHide.forEach(icon => {
                    icon.classList.replace("uil-eye", "uil-eye-slash");
                })
            }
        })
    })
})

// Функции для переключения форм
signup.addEventListener("click", (e) => {
    e.preventDefault()
    container.classList.add("active");
});
login.addEventListener("click", (e) => {
    e.preventDefault()
    container.classList.remove("active");
});

// ------------------------------------------------------------------------

// Функция для открытия формы в виде модального окна
const modalController = ({blackoutBackground, btnOpen, btnClose, time }) => {
    const buttonElem = document.querySelectorAll(btnOpen);
    const modalElem = document.querySelector(blackoutBackground);
    const navbar = document.querySelector('.global-navbar');

    modalElem.style.cssText = `
        display: flex;
        visibility: hidden;
        opacity: 0;
        transition: opacity ${time}ms ease-in-out;
    `;

    const openModal = () => {
        modalElem.style.visibility = "visible";
        modalElem.style.opacity = 1;
        navbar.style.display = "none";
        // window.addEventListener("keydown", closeModal)
    }

    const closeModal = (e) => {
        let target = e.target
        
        if (target.closest(btnClose)) {
            navbar.style.display = "flex";
            modalElem.style.opacity = 0;
            setTimeout(() => {
                modalElem.style.visibility = 'hidden';
            }, time);
        }
    }

    buttonElem.forEach(btn => {
        btn.addEventListener("click", openModal);
    });

    modalElem.addEventListener("click", closeModal);
}

modalController({
    blackoutBackground: ".blackout-background",
    btnOpen: ".open-form-button",
    btnClose: ".modal-close",
    time: 400
});

// ------------------------------------------------------------------------

const loginForm = document.querySelector(".login-form");
eField = loginForm.querySelector(".email"),
    eInput = eField.querySelector("input"),
    pField = loginForm.querySelector(".password"),
    pInput = pField.querySelector("input");

loginForm.onsubmit = (e) => {
    e.preventDefault();
    // Если адрес электронной почты и пароль пусты, добавляется в него класс встряхивания, иначе вызывается указанная функция
    (eInput.value == "") ? eField.classList.add("shake", "error") : checkLoginEmail();
    (pInput.value == "") ? pField.classList.add("shake", "error") : checkLoginPassword();

    setTimeout(() => { // Удаляется класс встряхивания через 500 мс
        eField.classList.remove("shake");
        pField.classList.remove("shake");
    }, 500);

    eInput.onkeyup = () => { checkLoginEmail(); } // Вызов функции checkLoginEmail при вводе электронной почты
    pInput.onkeyup = () => { checkLoginPassword(); } // Вызов функции checkLoginPassword при вводе пароля

    function checkLoginEmail() { // Функция проверки электронной почты
        let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; // Шаблон для проверки электронной почты
        if (!eInput.value.match(pattern)) { // Если шаблон не совпал, то добавляем ошибку и удаляем допустимый класс
            eField.classList.add("error");
            eField.classList.remove("valid");
            let errorTxt = eField.querySelector(".error-txt");
            // Если значение электронной почты не пусто, то показывается сообщение: "Введите действительный адрес электронной почты". Иначе показать сообщение: "Адрес электронной почты не может быть пустым"
            (eInput.value != "") ? errorTxt.innerText = "Неккоректный адрес" : errorTxt.innerText = "Заполните email";
        } else { // Если шаблон совпал, то удаляем ошибку и добавляем допустимый класс
            eField.classList.remove("error");
            eField.classList.add("valid");
        }
    }

    // Функция для проверки пароля
    function checkLoginPassword() {
        // Блок с условием для проверки не пусто ли поле с паролем а также для проверки длины пароля
        // if (pInput.value == "" || pInput.value.length < 12) { // Если поле с паролем пустое, то добавляем ошибку и удаляем допустимый класс
        //     pField.classList.add("error");
        //     let errorTxt = pField.querySelector(".error-txt");
        //     (pInput.value != "") ? errorTxt.innerText = "Не менее 12 символов" : errorTxt.innerText = "Заполните пароль"
        //     pField.classList.remove("valid");
        //     return;
        // } else { // Если поле с паролем не пустое, то удаляем ошибку и добавляем допустимый класс
        //     pField.classList.remove("error");
        // }

        // Блок с условием для проверки пустое ли поле с паролем 
        if (pInput.value != "") { // Если поле с паролем не пустое, то убираем ошибку и добавляем класс valid
            pField.classList.remove("error");
        } else { // Иначе если поле с паролем пустое, то добавляем ошибку и убираем класс valid
            pField.classList.remove("valid");
            let errorTxt = pField.querySelector(".error-txt");
            errorTxt.innerText = "Заполните пароль"
            pField.classList.add("error");
            return;
        }

        // Блок с условием для проверки длины пароля 
        if (pInput.value.length >= 12) { // Если поле с паролем имеет 12 символов, то убираем ошибку и добавляем класс valid
            pField.classList.remove("error");
        } else { // Иначе если поле с паролем не имеет 12 символов, то добавляем ошибку и убираем класс valid
            pField.classList.remove("valid");
            let errorTxt = pField.querySelector(".error-txt");
            errorTxt.innerText = "Не менее 12 символов"
            pField.classList.add("error");
            return;
        }

        // Блок с условием для проверки имеет ли поле с паролем lowerLetters
        let lowerCaseLetters = /[a-z]/g;
        if (pInput.value.match(lowerCaseLetters)) { // Если поле с паролем имеет lowerLetters, то убираем ошибку и добавляем класс valid
            pField.classList.remove("error");
        } else { // Иначе если поле с паролем не имеет lowerLetters, то добавляем ошибку и убираем класс valid
            pField.classList.remove("valid");
            let errorTxt = pField.querySelector(".error-txt");
            errorTxt.innerText = "Отсутствуют маленькие буквы"
            pField.classList.add("error");
            return;
        }

        // Блок с условием для проверки имеет ли поле с паролем upperLetters
        let upperCaseLetters = /[A-Z]/g;
        if (pInput.value.match(upperCaseLetters)) { // Если поле с паролем имеет upperCaseLetters, то убираем ошибку и добавляем класс valid
            pField.classList.remove("error");
        } else { // Иначе если поле с паролем не имеет upperCaseLetters, то добавляем ошибку и убираем класс valid
            pField.classList.remove("valid");
            let errorTxt = pField.querySelector(".error-txt");
            errorTxt.innerText = "Отсутствуют большие буквы"
            pField.classList.add("error");
            return;
        }

        // Блок с условием для проверки имеет ли поле с паролем цифры
        let numbers = /[0-9]/g;
        if (pInput.value.match(numbers)) { // Если поле с паролем имеет цифры, то убираем ошибку и добавляем класс valid
            pField.classList.remove("error");
        } else {// Иначе если поле с паролем не имеет цифр, то добавляем ошибку и убираем класс valid
            pField.classList.remove("valid");
            let errorTxt = pField.querySelector(".error-txt");
            errorTxt.innerText = "Отсутствуют цифры"
            pField.classList.add("error");
            return;
        }

        // Блок с условием которое проверяет все условия на положительный исход, если каждое условие выполняется то у поля с паролем убираютя все ошибки и добавляеться класс valid
        if (pInput.value.match(lowerCaseLetters) && pInput.value.match(upperCaseLetters) && pInput.value.match(numbers) && pInput.value != "" && pInput.value.length >= 12) {
            pField.classList.add("valid");
        }
    }
}


// ................................................
// функция отправки данных JSON
async function sendDataJson(url,data){
    let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      });
      let result = await responce.json()
      console.log(result)
}
// отправка формы 
let formRegistr = document.forms[1]

formRegistr.addEventListener('submit',function(){
    let submitData = {
        nickName:`${formRegistr[0].value}`,
        email:`${formRegistr[1].value}`,
        password:`${formRegistr[2].value}`
    }
    sendDataJson('/reg',submitData)
})
}
auth()

