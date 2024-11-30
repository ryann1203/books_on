document.addEventListener('DOMContentLoaded', () => {
    const logId = localStorage.getItem('viewLogId');

    if (!logId) {
        alert('독서기록 정보를 찾을 수 없습니다.');
        window.location.href = 'MyPage.html';
        return;
    }

    fetch(`http://127.0.0.1:8000/api/Readinglog/${logId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('book-cover').src = data.book.thumbnail;
            document.getElementById('book-title').innerText = data.book.title;
            document.getElementById('book-author').innerText = `저자: ${data.book.authors}`;
            document.getElementById('diary').value = data.diary;
        })
        .catch(error => {
            console.error('Error fetching reading log:', error);
            alert('독서기록 정보를 불러오는 데 실패했습니다.');
        });
});

async function updateReadingLog() {
    const diary = document.getElementById('diary').value;
    const logId = localStorage.getItem('viewLogId');

    if (!diary) {
        alert('리뷰를 작성해주세요!');
        return;
    }

    const updatedData = { diary };

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/Readinglog/${logId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert('독서기록이 수정되었습니다!');
            window.location.href = 'MyPage.html';
        } else {
            const errorData = await response.json();
            console.error('수정 실패:', errorData);
            alert('수정 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('수정 요청 오류:', error);
        alert('네트워크 오류가 발생했습니다.');
    }
}

document.getElementById('save-button').addEventListener('click', updateReadingLog);
