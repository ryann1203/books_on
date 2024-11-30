from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Group, GroupMember, Post
from .services import GroupService

class GroupSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)  # 생성자를 읽기 전용으로 표시
    members = serializers.SerializerMethodField()  # 그룹 멤버 목록

    class Meta:
        model = Group
        fields = ['id', 'name', 'created_by', 'created_at', 'members']

    def get_members(self, obj):
        # 그룹 멤버의 닉네임과 사용자 이름 반환
        return [{"id": member.user.id, "nickname": member.user.first_name, "username": member.user.username}
                for member in obj.members.all()]

class GroupCreateSerializer(serializers.ModelSerializer):
    member_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True  # 멤버 ID 목록
    )

    class Meta:
        model = Group
        fields = ['name', 'member_ids']

    def validate_member_ids(self, value):
        # 멤버 ID가 유효한지 확인
        users = User.objects.filter(id__in=value)
        if users.count() != len(value):
            raise serializers.ValidationError("일부 사용자가 존재하지 않습니다.")
        return value

    def create(self, validated_data):
        # 그룹 생성 및 멤버 추가
        member_ids = validated_data.pop('member_ids', [])
        created_by = self.context['request'].user
        # `services.py`의 GroupService 호출
        return GroupService.create_group_with_members(
            group_name=validated_data['name'],
            created_by=created_by,
            member_ids=member_ids
        )
    

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # 작성자 닉네임 표시

    class Meta:
        model = Post
        fields = '__all__'
