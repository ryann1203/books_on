// 내비게이션 바 추가 함수
function addNavigationBar() {
    // 이미 추가된 내비게이션 바가 있으면 중복 방지
    if (document.querySelector('.bottom-nav')) return;

    const navBar = `
        <div class="bottom-nav">
            <button onclick="navigateTo('myPage')">마이페이지</button>
            <button onclick="navigateTo('bookSearch')">도서 검색</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', navBar);
}

// 내비게이션 버튼 클릭 시 이동
function navigateTo(page) {
    console.log('Navigating to:', page); // 디버깅용 로그 추가
    if (page === 'bookSearch') {
        window.location.href = 'BookSearch.html';
    } else if (page === 'myPage') {
        window.location.href = 'MyPage.html';
    } else {
        console.error(`Unknown page: ${page}`);
    }
}

// 페이지 로드 시 내비게이션 추가
document.addEventListener('DOMContentLoaded', addNavigationBar);
