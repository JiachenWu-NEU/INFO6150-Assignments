const getSession = () => {
    try{
        const local = JSON.parse(localStorage.getItem('authSession')||'null');
        if(local && local.isLoggedIn) {
            return local;
        }
    } catch(_) {}
    try{
        const sess = JSON.parse(sessionStorage.getItem('authSession')||'null');
        if(sess && sess.isLoggedIn) {
            return sess;
        }
    } catch(_) {}
    return null;
};
const session = getSession();
if(!session) {
    window.location.replace('login.html');
}

if(session) {
    const username = (session.username || (session.email||'').split('@')[0] || 'User');
    $('#welcomeText').text(`Welcome, ${username}!`);
}

const numberPattern = /^\s*-?(?:\d+|\d*\.\d+)\s*$/;
const isValidNumber = v => numberPattern.test(v);
const showErr = ($el, msg) => $el.text(msg);
const clearErr = ($el) => $el.text('');
const readAndValidateInputs = () => {
    const $n1 = $('#num1');
    const $n2 = $('#num2');
    const v1 = $n1.val();
    const v2 = $n2.val();
    let ok = true;

    if(!v1.trim() || !isValidNumber(v1)) {
        showErr($('#num1Err'), 'Please enter a valid number');
        ok = false;
    } else {
        clearErr($('#num1Err'));
    }

    if(!v2.trim() || !isValidNumber(v2)){
        showErr($('#num2Err'), 'Please enter a valid number');
        ok = false;
    } else {
        clearErr($('#num2Err'));
    }
    return {
        ok, n1: parseFloat(v1),
        n2: parseFloat(v2)
    };
};

const calculate = (num1, num2, operation) => {
    switch(operation){
        case 'add': return num1 + num2;
        case 'subtract': return num1 - num2;
        case 'multiply': return num1 * num2;
        case 'divide':
            if(num2 === 0) {
                throw new Error('Division by zero');
            }
            return num1 / num2;
        default: throw new Error('Unknown operation');
    }
};

$('#num1, #num2').on('focus', function() {
    $(this.id === 'num1' ? '#num1Err' : '#num2Err').text('');
}).on('keyup blur', function() {
    readAndValidateInputs();
});

$('.btn').on('click', function() {
    const op = $(this).data('op');
    const { ok, n1, n2 } = readAndValidateInputs();
    if(!ok){
        $('#result').val('');
        return;
    }
    try{
        const out = calculate(n1, n2, op);
        $('#result').val(String(out)).fadeOut(50).fadeIn(100);
    }catch(err){
        $('#result').val('');
        if(op === 'divide' && n2 === 0) {
            $('#num2Err').text('Cannot divide by zero');
        } else {
            $('#num2Err').text(err.message);
        }
    }
});

$('#logoutBtn').on('click', function() {
    try{
        localStorage.removeItem('authSession');
    } catch(_) {}
    try{
        sessionStorage.removeItem('authSession');
    } catch(_) {}
});
$('#logoutBtn').on('click', function() {
    $('body').fadeOut(200, function() {
        window.location.href = 'login.html';
    });
});