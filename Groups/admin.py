from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Group)
admin.site.register(Friend)
admin.site.register(GroupMember)
admin.site.register(Post)