// CSRF 토큰 가져오기
function getCSRFToken() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
}

let invitedFriends = [];

// 친구 검색 버튼 클릭 이벤트
document.getElementById('search-friend-button').addEventListener('click', async () => {
    const searchQuery = document.getElementById('friend-search').value;
    const friendList = document.getElementById('friend-list');

    if (!searchQuery.trim()) {
        alert("검색어를 입력하세요.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/accounts/friends/search/?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const friends = await response.json();
            console.log("검색 결과:", friends); // 검색 결과 확인
            friendList.innerHTML = '';

            if (friends.length === 0) {
                friendList.innerHTML = '<li>친구를 찾을 수 없습니다.</li>';
                return;
            }

            friends.forEach((friend) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${friend.nickname} (${friend.username})`;

                const inviteButton = document.createElement('button');
                inviteButton.textContent = '초대';

                inviteButton.onclick = () => {
                    invitedFriends.push({ id: friend.id, nickname: friend.nickname, username: friend.username });

                    // 초대된 친구 목록 업데이트
                    updateInvitedFriendsList();
                    console.log("현재 초대한 친구들:", invitedFriends);
                };

                listItem.appendChild(inviteButton);
                friendList.appendChild(listItem);
            });
        } else {
            friendList.innerHTML = '<li>친구를 찾을 수 없습니다.</li>';
        }
    } catch (error) {
        console.error("친구 검색 오류:", error);
        friendList.innerHTML = '<li>오류가 발생했습니다.</li>';
    }
});

// 초대된 친구 목록 업데이트
function updateInvitedFriendsList() {
    const invitedList = document.getElementById('invited-friends');
    invitedList.innerHTML = '';

    invitedFriends.forEach((friend) => {
        const invitedItem = document.createElement('li');
        invitedItem.textContent = friend.nickname;
        invitedList.appendChild(invitedItem);
    });
}

// 그룹 입장 버튼 클릭 이벤트
document.getElementById('join-group-button').addEventListener('click', async () => {
    // 그룹명 가져오기
    const groupNameInput = document.getElementById("group-name").value;
    console.log("그룹 이름:", groupNameInput);
    // localStorage에 디버깅 정보 저장
    localStorage.setItem('debug_group_name', groupNameInput);

    if (!groupNameInput.trim()) {
        alert("그룹 이름을 입력하세요.");
        return;
    }
    
    if (invitedFriends.length === 0) {
        alert("그룹에 초대할 친구를 추가하세요.");
        return;
    }

    try {
        const csrfToken = getCSRFToken(); // CSRF 토큰 가져오기
        const response = await fetch('http://127.0.0.1:8000/api/groups/create/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // CSRF 토큰 추가
            },
            body: JSON.stringify({
                name: groupNameInput,
                member_ids: invitedFriends.map(friend => friend.id), // 초대된 친구들의 ID 전송
            }),
        });

        if (response.ok) {
            const groupData = await response.json();
            console.log("그룹 생성 성공:", groupData);

            // 초대된 친구 정보를 localStorage에 저장
            localStorage.setItem('groupId', groupData.id);
            console.log("저장된 groupId:", localStorage.getItem('groupId'));
            localStorage.setItem('invitedFriends', JSON.stringify(invitedFriends));

            // GroupBooks.html로 이동
            window.location.href = 'GroupBooks.html';
        } else {
            const errorData = await response.json();
            console.error("그룹 생성 실패:", errorData);
            alert("그룹 생성 실패: " + errorData.error);
        }
    } catch (error) {
        console.error("그룹 생성 오류:", error);
        alert("오류가 발생했습니다.");
    }
});
