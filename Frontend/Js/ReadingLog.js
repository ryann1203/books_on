// 토큰 가져오기 (로컬스토리지에서)
function getToken() {
    return localStorage.getItem('access_token');
}

// 뒤로 가기 버튼
function goBack() {
    window.history.back();
}

// 상세 내용 보기
function showDetails() {
    const contents = localStorage.getItem('bookContents');
    if (contents) {
        alert(`상세내용: ${contents}`);
    } else {
        alert('상세내용이 없습니다.');
    }
}

// 독서기록 저장 함수
async function saveReadingLog() {
    const diary = document.getElementById('diary').value;

    if (!diary) {
        alert('리뷰를 작성해주세요!');
        return;
    }
    const bookData = {
        isbn: localStorage.getItem('bookId'), 
        title: localStorage.getItem('bookTitle'),
        authors: localStorage.getItem('bookAuthor') ? localStorage.getItem('bookAuthor').split(', ') : [],
        publisher: localStorage.getItem('bookPublisher'),
        publication_date: localStorage.getItem('bookDate'),
        thumbnail: localStorage.getItem('bookCover'),
        contents: localStorage.getItem('bookContents'),
        diary: document.getElementById('diary').value
    };

    const bookId = localStorage.getItem('bookId'); // 로컬스토리지에서 bookId 가져오기
    if (!bookId) {
        alert('저장할 책 정보가 없습니다.');
        return;
    }
    console.log("Book data to send:", bookData);

    try {
        const accessToken = getToken(); // 토큰 가져오기
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            window.location.href = 'Login.html'; // 로그인 페이지로 리다이렉트
            return;
        }

        const response = await fetch('http://127.0.0.1:8000/api/Readinglog/save-readinglog/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            alert('독서기록이 저장되었습니다!');
            window.location.href = 'BookSearch.html'; // 저장 후 검색 페이지로 이동
        } else {
            const errorData = await response.json();
            console.error('저장 실패:', errorData);
            alert('저장 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('저장 요청 오류:', error);
        //alert('네트워크 오류가 발생했습니다.');
    }
}

// 페이지 로드 시 책 정보 표시
document.addEventListener('DOMContentLoaded', () => {
    const bookTitle = localStorage.getItem('bookTitle');
    const bookAuthor = localStorage.getItem('bookAuthor');
    const bookPublisher = localStorage.getItem('bookPublisher');
    const bookDate = localStorage.getItem('bookDate');
    const bookCover = localStorage.getItem('bookCover');

    if (bookTitle && bookAuthor && bookPublisher && bookDate && bookCover) {
        document.getElementById('book-title').innerText = bookTitle;
        document.getElementById('book-author').innerText = `저자: ${bookAuthor}`;
        document.getElementById('book-publisher').innerText = `출판사: ${bookPublisher}`;
        document.getElementById('book-date').innerText = `출판일: ${bookDate}`;
        document.getElementById('book-cover').src = bookCover;
    }
});

// 저장하기 버튼 클릭 이벤트
document.getElementById('save-button').addEventListener('click', saveReadingLog);
