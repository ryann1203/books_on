document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/rest_auth/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('로그인 성공!');
            window.location.href = 'BookSearch.html';
        } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData);
            alert('로그인 실패: ' + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('오류가 발생했습니다.');
    }
});
