from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignUpSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

class SignUpView(APIView):
    """회원가입 API 뷰"""
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '회원가입 성공!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class SearchFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get('query', '')
        if not query:
            return Response([], status=200)

        users = User.objects.filter(username__icontains=query)[:10]
        friends = [{'id': user.id, 'username': user.username, 'nickname': user.first_name} for user in users]
        return Response(friends, status=200)

