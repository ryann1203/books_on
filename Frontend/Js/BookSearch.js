async function searchBooks() {
    const query = document.getElementById('bookQuery').value;
    const resultDiv = document.getElementById('result');

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/Readinglog/search-books/?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        resultDiv.innerHTML = ''; // 기존 결과 초기화

        if (data.length > 0) {
            data.forEach(book => {
                const bookInfo = `
                    <div>
                        <h3>${book.title}</h3>
                        <p>저자: ${book.authors.join(', ')}</p>
                        <p>출판사: ${book.publisher}</p>
                        <img src="${book.thumbnail}" alt="${book.title}" style="width:100px; height:auto;" />
                    </div>
                `;
                resultDiv.innerHTML += bookInfo;
            });
        } else {
            resultDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p>오류가 발생했습니다.</p>';
    }
}

// 로그아웃 버튼 클릭 이벤트
document.getElementById('logout-button').addEventListener('click', async () => {
    try {
        // 백엔드에 로그아웃 요청 보내기
        const response = await fetch('http://127.0.0.1:8000/api/rest_auth/logout/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        // 쿠키에서 토큰 제거
        document.cookie = 'access_token=; Max-Age=0';
        document.cookie = 'refresh_token=; Max-Age=0';

        if (response.ok) {
            alert('로그아웃 성공!');
            window.location.href = 'Login.html'; // 로그인 페이지로 이동
        } else {
            console.error('로그아웃 실패:', await response.json());
            alert('로그아웃에 실패했습니다.');
        }
    } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
        alert('오류가 발생했습니다.');
    }
});
