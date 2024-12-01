from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import GroupCreateSerializer, GroupSerializer, PostSerializer
from .models import Group, Post, GroupMember
from Readinglog.models import Book
from Readinglog.serializers import BookSerializer
from django.db import transaction

class CreateGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Request Data:", request.data)  # 요청 데이터 확인
        serializer = GroupCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                with transaction.atomic():  # 트랜잭션 블록
                    group = serializer.save()
                    # 요청 사용자를 GroupMember로 추가
                    GroupMember.objects.create(group=group, user=request.user)

                    group_data = GroupSerializer(group).data
                    print("Created Group Data:", group_data)  # 직렬화된 그룹 데이터 확인
                    return Response(group_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print("Error during group creation:", e)
                return Response({"error": "Failed to create group."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class AddBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_id):
        print("Received group_id:", group_id)  # 전달된 group_id 확인
        try:
            group = Group.objects.get(id=group_id)
            # 요청 데이터에서 책 정보를 가져옴
            isbn = request.data.get("isbn")
            book_data = {
                "title": request.data.get("title"),
                "authors": request.data.get("authors"),
                "publisher": request.data.get("publisher"),
                "publication_date": request.data.get("publication_date"),
                "thumbnail": request.data.get("thumbnail"),
            }

            # ISBN이 없으면 에러 반환
            if not isbn:
                return Response({"error": "ISBN is required."}, status=status.HTTP_400_BAD_REQUEST)

            # ISBN으로 책 검색 또는 생성
            book, created = Book.objects.get_or_create(
                isbn=isbn,
                defaults=book_data,  # 새로운 책일 경우 추가 필드 저장
            )

            if created:
                print(f"New book '{book.title}' created.")
            else:
                print(f"Book '{book.title}' already exists.")

            group.books.clear()  # 이전에 추가된 책 제거
            group.books.add(book)  # 도서를 그룹에 추가
            group.save()

            print(f"Books in group '{group.name}':", group.books.all())  # 그룹의 책들 출력

            return Response({"message": f"Book '{book.title}' added to group '{group.name}'."}, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)
        except Book.DoesNotExist:
            return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class GroupDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        try:
            group = Group.objects.get(id=group_id)
            book = group.books.first()  # 선택된 책 (하나만 저장되므로)
            group_data = GroupSerializer(group).data
            book_data = BookSerializer(book).data if book else None

            return Response({"group": group_data, "book": book_data}, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)
        

class PostListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        try:
            group = Group.objects.get(id=group_id)
            posts = Post.objects.filter(group=group).order_by('-created_at')  # 최신 글부터 조회
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, group_id):
        try:
            group = Group.objects.get(id=group_id)
            content = request.data.get('content')
            if not content:
                return Response({"error": "Content is required."}, status=status.HTTP_400_BAD_REQUEST)

            post = Post.objects.create(group=group, user=request.user, content=content)
            serializer = PostSerializer(post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Group.DoesNotExist:
            return Response({"error": "Group not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)