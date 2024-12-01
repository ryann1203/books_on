from django.db import models
from Readinglog.models import Book
from django.contrib.auth.models import User

# Create your models here.
class Group(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_groups') #생성자
    created_at = models.DateTimeField(auto_now_add=True)
    books = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='groups', blank=True, null=True)  # 그룹과 연결된 도서들

    def __str__(self):
        return self.name
    
class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='members')  # 그룹
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_memberships')  # 사용자
    joined_at = models.DateTimeField(auto_now_add=True)  # 가입 시각

    class Meta:
        unique_together = ('group', 'user')  # 한 그룹에 동일한 유저가 중복되지 않도록 설정

    def __str__(self):
        return f"{self.group.name}의 멤버"
    
    

class Post(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='posts')  # 소속 그룹
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')  # 작성자
    content = models.TextField()  # 글 내용
    created_at = models.DateTimeField(auto_now_add=True)  # 작성 시간

    def __str__(self):
        return f"{self.user.username} in {self.group.name}: {self.content[:30]}"