// localStorage에서 토큰 가져오기
function getToken(key) {
    return localStorage.getItem(key);
}

// 페이지 로드 시 토큰 출력
function displayTokens() {
    const accessToken = getToken('access_token');
    const refreshToken = getToken('refresh_token');

    console.log('Access Token:', accessToken || 'Not Found');
    //console.log('Refresh Token:', refreshToken || 'Not Found');
}

// 선택한 책 정보를 로컬스토리지에 저장
async function selectBook(book) {
    console.log('Selected Book:', book); // 선택된 책 정보 확인
    
    localStorage.setItem('bookId', book.isbn);
    localStorage.setItem('bookTitle', book.title);
    localStorage.setItem('bookAuthor', book.authors.join(', '));
    localStorage.setItem('bookPublisher', book.publisher);
    localStorage.setItem('bookDate', book.datetime.split('T')[0]);
    localStorage.setItem('bookCover', book.thumbnail);
    localStorage.setItem('bookContents', book.contents);

    window.location.href = 'ReadingLog.html';
}

// 검색 함수
async function searchBooks() {
    const query = document.getElementById('bookQuery').value;
    const resultDiv = document.getElementById('result');

    try {
        const accessToken = getToken('access_token');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            window.location.href = 'Login.html';
            return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/Readinglog/search-books/?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
                window.location.href = 'Login.html';
                return;
            }
            const errorData = await response.json();
            console.error('검색 실패:', errorData);
            resultDiv.innerHTML = `<p>검색에 실패했습니다: ${errorData.error}</p>`;
            return;
        }

        const books = await response.json();
        resultDiv.innerHTML = '';

        if (books.length > 0) {
            books.forEach((book, index) => {
                const bookInfo = `
                    <div>
                        <h3>${book.title}</h3>
                        <p>저자: ${book.authors.join(', ')}</p>
                        <p>출판사: ${book.publisher}</p>
                        <img src="${book.thumbnail}" alt="${book.title}" style="width:100px; height:auto;" />
                        <button onclick='selectBook(${JSON.stringify(book)})'>독서기록 작성</button>
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
document.getElementById('logout-button').addEventListener('click', () => {
    // localStorage에서 토큰 제거
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    alert('로그아웃 성공!');
    window.location.href = 'Login.html'; // 로그인 페이지로 이동
});

// 페이지 로드 시 토큰 출력
window.onload = displayTokens;
