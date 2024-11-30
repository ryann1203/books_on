async function loadGroupDetails() {
    const groupId = localStorage.getItem('groupId');
    if (!groupId) {
        alert('그룹 정보를 찾을 수 없습니다.');
        window.location.href = 'GroupBooks.html'; // 이전 페이지로 이동
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/detail/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const group = data.group;
            const book = data.book;

            // 그룹 정보 표시
            document.getElementById('group-name').innerText = group.name;
            document.getElementById('group-members').innerText = group.members.map(m => m.nickname).join(', ');
            document.getElementById('group-created-at').innerText = `생성일: ${new Date(group.created_at).toLocaleDateString()}`;

            // 책 정보 표시
            if (book) {
                document.getElementById('book-title').innerText = book.title;
                document.getElementById('book-author').innerText = book.authors;
                document.getElementById('book-cover').src = book.thumbnail;
            } else {
                alert('선택된 책이 없습니다.');
            }
        } else {
            const error = await response.json();
            console.error('그룹 상세 정보 로드 실패:', error);
            alert(error.error);
        }
    } catch (error) {
        console.error('API 호출 오류:', error);
        alert('네트워크 오류가 발생했습니다.');
    }
}

async function loadPosts(groupId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/posts/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        });

        if (response.ok) {
            const posts = await response.json();
            const postList = document.getElementById('post-list');
            postList.innerHTML = '';

            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <p><strong>${post.user}</strong>: ${post.content}</p>
                    <small>${new Date(post.created_at).toLocaleString()}</small>
                `;
                postList.appendChild(postElement);
            });
        } else {
            console.error('게시글 로드 실패');
        }
    } catch (error) {
        console.error('API 호출 오류:', error);
    }
}

document.getElementById('submit-post').addEventListener('click', async () => {
    const groupId = localStorage.getItem('groupId');
    const content = document.getElementById('post-content').value;

    if (!content.trim()) {
        alert('내용을 입력하세요.');
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/groups/${groupId}/posts/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            document.getElementById('post-content').value = '';
            loadPosts(groupId); // 글 작성 후 게시글 목록 재로딩
        } else {
            console.error('글 작성 실패');
        }
    } catch (error) {
        console.error('API 호출 오류:', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const groupId = localStorage.getItem('groupId');
    loadPosts(groupId); // 페이지 로드 시 게시글 조회
});


document.addEventListener('DOMContentLoaded', loadGroupDetails);
