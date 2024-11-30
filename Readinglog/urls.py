from django.urls import path
from .views import SearchBooksView, SaveReadingLogView, MyReadingLogsView, ReadingLogDetailView

urlpatterns = [
    path('search-books/', SearchBooksView.as_view(), name='search_books'),  # 검색 API
    path('save-readinglog/', SaveReadingLogView.as_view(), name='save_reading_log'),  # 독서기록 저장 API
    path('mypage/', MyReadingLogsView.as_view(), name='my_page'),  # 마이페이지
    path('<int:log_id>/', ReadingLogDetailView.as_view(), name='reading-log-detail'),  # 독서기록 상세
]