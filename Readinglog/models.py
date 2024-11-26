from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    id = models.AutoField(primary_key=True) # 테이블 번호
    title = models.CharField(max_length=255)
    authors = models.CharField(max_length=255)
    publisher = models.CharField(max_length=255)
    publication_date = models.DateField()
    thumbnail = models.URLField()
    contents = models.TextField()

    def __str__(self):
        return f"{self.title} by {self.authors}"
    
    
class ReadingLog(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reading_logs')  # 사용자
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reading_logs')  # 해당 책 정보
    diary = models.TextField()  # 독서 기록 내용 (한 줄 리뷰)
    created_at = models.DateTimeField(auto_now_add=True)  # 기록 생성 시간
    updated_at = models.DateTimeField(auto_now=True)  # 기록 수정 시간

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"