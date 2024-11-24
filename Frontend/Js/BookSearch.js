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
