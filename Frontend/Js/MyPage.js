document.addEventListener('DOMContentLoaded', () => {
    const logsContainer = document.getElementById('logs-container');
    const groupBooksContainer = document.getElementById('group-books-container'); // 독서모임 책 컨테이너
    const inviteModal = document.getElementById('invite-modal');
    const closeModalButton = document.getElementById('close-modal');
    const logoutButton = document.getElementById('logout-button');

    // 토큰 가져오기
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        alert('로그인이 필요합니다.');
        window.location.href = 'Login.html';
        return;
    }

    // 로그아웃 버튼 클릭 이벤트 추가
    logoutButton.addEventListener('click', () => {
        // 로컬스토리지에서 인증 토큰 삭제
        localStorage.removeItem('access_token');
        alert('로그아웃 되었습니다.');
        window.location.href = 'Login.html'; // Login 페이지로 이동
    });

    // API에서 사용자의 독서 기록 가져오기
    fetch('http://127.0.0.1:8000/api/Readinglog/mypage/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('API 응답 데이터:', data);
            console.log('Group Books:', data.group_books);
            
            if (data.length === 0) {
                logsContainer.innerHTML = '<p>작성한 독서기록이 없습니다.</p>';
                return;
            }
            else {
                data.logs.forEach(log => {
                    const logCard = document.createElement('div');
                    logCard.className = 'log-card';

                    logCard.innerHTML = `
                        <img src="${log.book.thumbnail}" alt="${log.book.title}">
                        <p>${log.book.title}</p>
                    `;
                    logCard.onclick = () => {
                        localStorage.setItem('viewLogId', log.id);
                        localStorage.setItem('fromMyPage', 'true'); // MyPage에서 들어온 플래그 설정
                        window.location.href = 'EditReadingLog.html';
                    };

                    logsContainer.appendChild(logCard);
                });
            }
            
        // 독서모임 책 표시
        if (data.group_books.length === 0) {
            groupBooksContainer.innerHTML = '<p>참여한 독서모임이 없습니다.</p>';
        } else {
            data.group_books.forEach(groupBook => {
                if (groupBook.book.title) {
                    const groupBookCard = document.createElement('div');
                    groupBookCard.className = 'log-card';

                    groupBookCard.innerHTML = `
                        <img src="${groupBook.book.thumbnail}" alt="${groupBook.book.title}">
                        <p><strong>${groupBook.group_name}</strong>: ${groupBook.book.title}</p>
                    `;

                    groupBookCard.onclick = () => {
                        if (!groupBook.group_id) {
                            console.error('그룹 ID가 없습니다:', groupBook);
                            alert('그룹 정보를 가져오는 데 실패했습니다.');
                            return;
                        }
                        localStorage.setItem('groupId', groupBook.group_id); // 그룹 ID 저장
                        window.location.href = 'GroupLog.html'; // GroupLog 페이지로 이동
                    };

                    groupBooksContainer.appendChild(groupBookCard);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching logs:', error);
            logsContainer.innerHTML = '<p>오류가 발생했습니다. 다시 시도해주세요.</p>';
        });

    // 그룹 생성 버튼 클릭 시 모달 열기
    document.getElementById('create-group-button').addEventListener('click', () => {
        inviteModal.style.display = 'flex';
    });

    // 모달 닫기 버튼 클릭 시
    closeModalButton.addEventListener('click', () => {
        inviteModal.style.display = 'none';
    });
});
