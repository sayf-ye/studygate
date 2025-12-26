from django.urls import path
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('index.html', views.HomeView.as_view()),

    path('about/', views.AboutView.as_view(), name='about'),
    path('about.html', views.AboutView.as_view()),

    path('services/', views.ServicesView.as_view(), name='services'),
    path('services.html', views.ServicesView.as_view()),

    path('partners/', views.PartnersView.as_view(), name='partners'),
    path('partners.html', views.PartnersView.as_view()),

    path('contact/', views.contact_view, name='contact'),
    path('contact.html', views.contact_view),

    path('blog/', views.BlogListView.as_view(), name='blog_list'),
    path('blog.html', views.BlogListView.as_view()),
    path('blog/<slug:slug>/', views.BlogDetailView.as_view(), name='blog_detail'),
    path('blog/<slug:slug>.html', views.BlogDetailView.as_view()),

    # Language centers
    path('language-center/<slug:slug>/', views.LanguageCenterDetailView.as_view(), name='language_center_detail'),
    path('language-center/<slug:slug>.html', views.LanguageCenterDetailView.as_view()),
]
