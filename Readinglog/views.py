from django.http import JsonResponse
import requests
from BooksOn import my_settings
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Book, ReadingLog
from .serializers import BookSerializer, ReadingLogSerializer

KAKAO_API_KEY = my_settings.KAKAO_API_KEY

class SearchBooksView(APIView):
    permission_classes = [IsAuthenticated]  # 사용자 인증 필요

    def get(self, request):
        query = request.GET.get('query', '')
        if not query:
            return Response({'error': '검색어를 입력해주세요.'}, status=400)

        url = 'https://dapi.kakao.com/v3/search/book'
        headers = {'Authorization': f'KakaoAK {KAKAO_API_KEY}'}
        params = {'query': query, 'size': 10}

        response = requests.get(url, headers=headers, params=params)
        if response.status_code != 200:
            return Response({'error': '카카오 API 호출 실패'}, status=response.status_code)

        books = response.json().get('documents', [])
        return Response(books)


class SaveReadingLogView(APIView):
    """
    사용자가 독서기록을 저장했을 때만 DB에 기록 저장
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # 요청에서 책 정보와 독서기록을 분리
        title = request.data.get('title')  # 제목을 기준으로 처리
        authors = request.data.get('authors', [])
        diary = request.data.get('diary')
        publisher = request.data.get('publisher', '')
        publication_date = request.data.get('publication_date', '')
        thumbnail = request.data.get('thumbnail', '')
        contents = request.data.get('contents', '')

        if not title or not diary:
            return Response({'error': '책 제목과 독서기록이 모두 필요합니다.'}, status=400)

        # 책 정보 DB 저장
        book, created = Book.objects.get_or_create(
            title=title,
            authors=', '.join(authors),
            defaults={
                'publisher': publisher,
                'publication_date': publication_date,
                'thumbnail': thumbnail,
                'contents': contents,
            }
        )

        # 독서 기록 저장
        reading_log = ReadingLog.objects.create(
            user=request.user,
            book=book,
            diary=diary
        )

        serializer = ReadingLogSerializer(reading_log)
        return Response(serializer.data, status=201)
    

class MyReadingLogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logs = ReadingLog.objects.filter(user=request.user).select_related('book')
        serializer = ReadingLogSerializer(logs, many=True)
        return Response(serializer.data)