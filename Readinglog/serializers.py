from rest_framework import serializers
from .models import Book, ReadingLog

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'authors', 'publisher', 'publication_date', 'thumbnail', 'contents']


class ReadingLogSerializer(serializers.ModelSerializer):
    book = BookSerializer()  # 책 정보를 포함하도록 확장
    
    class Meta:
        model = ReadingLog
        fields = ['id', 'book', 'diary', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
