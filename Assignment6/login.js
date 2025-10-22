const USERS = [
    {email: "alice@northeastern.edu", password: "Password123" },
    {email: "husky@northeastern.edu", password: "GoHuskies2025" },
    {email: "student@northeastern.edu", password: "Welcome2024" }
];

function isValidNEUEmail(value) {
    const pattern = /^[A-Za-z0-9._%+-]+@northeastern\.edu$/i;
    return pattern.test(String(value).trim());
}

function enableButtonIfValid() {
    const ok = validateEmail(false) & validatePassword(false);
    if(ok) {
        $("#loginBtn").prop("disabled", false).addClass("enabled");
    } else {
        $("#loginBtn").prop("disabled", true).removeClass("enabled");
    }
}

function validateEmail(showMsg=true) {
    const val = $("#email").val();
    const $err = $("#emailError");
    let ok = true;
    if(!val || !val.trim()) {
        ok = false;
        if(showMsg) {
          $err.text("Please enter a valid Northeastern email");
        }
    } else if(!isValidNEUEmail(val)) {
        ok = false;
        if(showMsg) {
            $err.text("Please enter a valid Northeastern email");
        }
    }
    if(ok && showMsg) {
        $err.text("");
    }
    return ok;
}
function validatePassword(showMsg=true) {
    const val = $("#password").val();
    const $err = $("#passwordError");
    let ok = true;
    if(!val || !val.trim()) {
        ok = false;
        if(showMsg) {
            $err.text("Password cannot be empty");
        }
    } else if (val.length < 8) {
        ok = false;
        if(showMsg) {
            $err.text("Password must be at least 8 characters");
        }
    }
    if(ok && showMsg) {
        $err.text("");
    }
    return ok;
}

$(function(){
    $("#email").on("focus", function(){
        $("#emailError").text(""); $("#formError").text("");
    });
    $("#password").on("focus", function(){
        $("#passwordError").text(""); $("#formError").text("");
    });
    $("#email").on("keyup blur", function(){
        validateEmail(true); enableButtonIfValid();
    });
    $("#password").on("keyup blur", function(){
        validatePassword(true); enableButtonIfValid();
    });
    $("#loginForm").on("submit", function(e){
        e.preventDefault();
        const emailOk = validateEmail(true);
        const passOk = validatePassword(true);
        enableButtonIfValid();
        if(!(emailOk && passOk)) {
            return;
        }
        const email = $("#email").val().trim();
        const password = $("#password").val();
        const match = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if(!match) {
            $("#formError").text("Invalid email or password");
            $("#loginSuccess").hide();
            return;
        }
        const store = $("#rememberMe").is(":checked") ? window.localStorage : window.sessionStorage;
        const username = email.split("@")[0];
        const sessionObj = {
            username: username,
            email: email,
            loginTimestamp: new Date().toISOString(),
            isLoggedIn: true
        };
        try{
            store.setItem("authSession", JSON.stringify(sessionObj));
        }catch(err){
            window.sessionStorage.setItem("authSession", JSON.stringify(sessionObj));
        }
        $("#formError").text("");
        $("#loginSuccess").stop(true,true).hide().slideDown(200).delay(1500).fadeOut(300, function(){
            window.location.href = "calculator.html";
        });
    });
    enableButtonIfValid();
});