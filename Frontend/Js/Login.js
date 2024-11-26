document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        //const csrfToken = getCSRFToken(); // CSRF 토큰 가져오기
        const response = await fetch('http://127.0.0.1:8000/api/rest_auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'X-CSRFToken': csrfToken, // CSRF 토큰 추가
            },
            //credentials: 'include',  // 쿠키를 포함하도록 설정
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login response data:', data); // 응답 데이터를 콘솔에 출력

            // JWT 토큰을 localStorage에 저장
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

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
