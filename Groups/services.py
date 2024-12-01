from django.db import transaction
from .models import Group, GroupMember
from django.contrib.auth.models import User

class GroupService:
    @staticmethod
    def create_group_with_members(group_name, created_by, member_ids):
        """
        그룹 생성과 멤버 추가를 트랜잭션으로 처리
        """
        try:
            with transaction.atomic():
                # 그룹 생성
                group = Group.objects.create(name=group_name, created_by=created_by)
                print("Creating Group with Name:", group_name)


                # 멤버 추가
                for member_id in member_ids:
                    user = User.objects.get(id=member_id)  # 멤버 ID를 기반으로 유저 가져오기
                    # 중복 확인
                    if not GroupMember.objects.filter(group=group, user=user).exists():
                        GroupMember.objects.create(group=group, user=user)
                
                return group  # Group 객체 반환
        except Exception as e:
            raise e
