from django.urls import path
from .views import SignUpView, SearchFriendView

urlpatterns = [
    path('register/', SignUpView.as_view(), name='user-register'),
    path('friends/search/', SearchFriendView.as_view(), name='search-friend'),
]
