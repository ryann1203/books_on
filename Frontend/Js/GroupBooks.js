document.addEventListener('DOMContentLoaded', () => {
    const groupId = localStorage.getItem('groupId');
    console.log("로컬스토리지에서 로드된 groupId:", groupId); // 로드된 groupId 확인

    if (!groupId) {
        alert("그룹 ID를 찾을 수 없습니다. 이전 페이지로 돌아갑니다.");
        window.location.href = 'InviteModal.html'; // InviteModal 페이지로 이동
        return;
    }

    const debugGroupName = localStorage.getItem('debug_group_name');
    if (debugGroupName) {
        console.log("이전 페이지에서 전달된 그룹 이름:", debugGroupName);

        // 필요 시 localStorage에서 삭제
        localStorage.removeItem('debug_group_name');
    }
});

async function searchBooks() {
    const query = document.getElementById('bookQuery').value;
    const resultDiv = document.getElementById('result');

    // 초대된 친구들 정보 가져오기
    const invitedFriends = JSON.parse(localStorage.getItem('invitedFriends')) || [];
    console.log('초대된 친구들:', invitedFriends);

    try {
        // 책 검색 API 호출
        const response = await fetch(`http://127.0.0.1:8000/api/Readinglog/search-books/?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (response.ok) {
            const books = await response.json();
            resultDiv.innerHTML = ''; // 이전 검색 결과 초기화

            if (books.length === 0) {
                resultDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
                return;
            }

            // 검색된 책 표시
            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                bookCard.innerHTML = `
                    <img src="${book.thumbnail}" alt="${book.title}" class="book-thumbnail">
                    <h3>${book.title}</h3>
                    <p>${book.authors.join(', ')}</p>
                    <button class="select-book-button">선택</button>
                `;

                 // '선택' 버튼 클릭 이벤트
                 const selectButton = bookCard.querySelector('.select-book-button');
                 selectButton.addEventListener('click', () => {
                     console.log('선택한 책:', book.title);
 
                     const groupId = localStorage.getItem('groupId'); // 그룹 ID 가져오기
                     // 책 데이터 구성
                     const bookData = {
                        title: book.title,
                        authors: book.authors.join(', '),
                        publisher: book.publisher,
                        publication_date: book.datetime.split('T')[0], // 필요한 경우 추가
                        thumbnail: book.thumbnail,
                        isbn: book.isbn, // ISBN 추가
                    };

                    console.log("선택한 책 데이터:", bookData); // 선택한 책 데이터 확인
                    addBookToGroup(groupId, bookData);
                 });

                resultDiv.appendChild(bookCard);
            });
        } else {
            resultDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
        }
    } catch (error) {
        console.error('책 검색 오류:', error);
        resultDiv.innerHTML = '<p>오류가 발생했습니다.</p>';
    }
}

async function addBookToGroup(groupId, bookData) {
    console.log(`보내는 groupId: ${groupId}, bookData:`, bookData); // 전달되는 값 확인
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/add-book/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData), 
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);  // 성공 메시지 출력
            window.location.href = 'GroupLog.html'; 
        } else {
            const error = await response.json();
            console.error("도서 추가 실패:", error);
            alert(error.error);
        }
    } catch (error) {
        console.error("도서 추가 오류:", error);
        alert("오류가 발생했습니다.");
    }
}

