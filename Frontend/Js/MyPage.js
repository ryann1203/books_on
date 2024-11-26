document.addEventListener('DOMContentLoaded', () => {
    const logsContainer = document.getElementById('logs-container');

    // 토큰 가져오기
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        alert('로그인이 필요합니다.');
        window.location.href = 'Login.html';
        return;
    }
    
    // API에서 사용자의 독서 기록 가져오기
    fetch('http://127.0.0.1:8000/api/Readinglog/mypage/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                logsContainer.innerHTML = '<p>작성한 독서기록이 없습니다.</p>';
                return;
            }

            // 독서 기록을 동적으로 추가
            data.forEach(log => {
                const logCard = document.createElement('div');
                logCard.className = 'log-card';
                console.log("API Response Log:", log);

                logCard.innerHTML = `
                    <img src="${log.book.thumbnail}" alt="${log.book.title}">
                    <p>${log.book.title}</p>
                `;
                logCard.onclick = () => {
                    // 클릭 시 해당 독서 기록 보기 페이지로 이동
                    localStorage.setItem('viewLogId', log.id);
                    window.location.href = 'viewReadingLog.html';
                };

                logsContainer.appendChild(logCard);
            });
        })
        .catch(error => {
            console.error('Error fetching logs:', error);
            logsContainer.innerHTML = '<p>오류가 발생했습니다. 다시 시도해주세요.</p>';
        });
});
