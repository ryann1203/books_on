from django.contrib.auth.models import User
from rest_framework import serializers

class SignUpSerializer(serializers.ModelSerializer):
    """회원가입용 Serializer"""
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name']  # first_name을 닉네임으로 사용
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},  # 닉네임 필수
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            first_name=validated_data['first_name']  # 닉네임 저장
        )
        return user
