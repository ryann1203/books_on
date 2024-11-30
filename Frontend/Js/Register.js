document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const nickname = document.getElementById('nickname').value;
    const password1 = document.getElementById('password1').value;
    const password2 = document.getElementById('password2').value;

    if (password1 !== password2) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/accounts/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username, email, first_name: nickname, password: password1  }),
        });

        if (response.ok) {
            alert('회원가입 성공!');
            window.location.href = 'Login.html';
        } else {
            const errorData = await response.json();
            console.error('Registration failed:', errorData);
            alert('회원가입 실패: ' + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('오류가 발생했습니다.');
    }
});
