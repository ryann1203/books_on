from django.urls import path
from .views import CreateGroupView, GroupDetailView, AddBookView, PostListCreateView

urlpatterns = [
    path('create/', CreateGroupView.as_view(), name='create-group'),
    path('<int:group_id>/add-book/', AddBookView.as_view(), name='add-book-to-group'),
    path('<int:group_id>/detail/', GroupDetailView.as_view(), name='group-detail'),
    path('<int:group_id>/posts/', PostListCreateView.as_view(), name='group-posts'),
]
