from django.http import JsonResponse
import requests
from BooksOn import my_settings

KAKAO_API_KEY = my_settings.KAKAO_API_KEY

def search_books(request):
    query = request.GET.get('query', '')
    if not query:
        return JsonResponse({'error': 'Query parameter is required.'}, status=400)

    url = 'https://dapi.kakao.com/v3/search/book'
    headers = {
        'Authorization': f'KakaoAK {KAKAO_API_KEY}'
    }
    params = {
        'query': query,
        'size': 10
    }
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        # 카카오 API에서 받은 원본 데이터를 가져옴
        documents = response.json().get('documents', [])
        
        # 필요한 데이터만 필터링하여 새로운 리스트로 변환
        result = [
            {
                'title': book.get('title'),
                'authors': book.get('authors'),
                'publisher': book.get('publisher'),
                'thumbnail': book.get('thumbnail'),  # 책 표지 URL 추가
            }
            for book in documents
        ]
        return JsonResponse(result, safe=False)
    else:
        return JsonResponse({'error': f'Failed to fetch data from Kakao API. {response.text}'}, status=response.status_code)
