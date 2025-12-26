from django.contrib import admin

from .models import ContactMessage, Post
from .models import LanguageCenter, LanguageCenterApplication, University


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
	list_display = ('title', 'slug', 'published_at', 'category')
	prepopulated_fields = {'slug': ('title',)}
	search_fields = ('title', 'excerpt', 'category')
	list_filter = ('category', 'published_at')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
	list_display = ('name', 'email', 'phone', 'country', 'major', 'created_at')
	search_fields = ('name', 'email', 'phone', 'country', 'major', 'message')
	readonly_fields = ('created_at',)

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
	list_display = ('name', 'slug', 'location', 'is_active', 'sort_order')
	list_editable = ('is_active', 'sort_order')
	prepopulated_fields = {'slug': ('name',)}
	search_fields = ('name', 'description', 'location')
	list_filter = ('is_active',)
	ordering = ('sort_order', 'name')

@admin.register(LanguageCenter)
class LanguageCenterAdmin(admin.ModelAdmin):
	list_display = ('name', 'slug', 'location', 'is_active', 'sort_order')
	list_editable = ('is_active', 'sort_order')
	prepopulated_fields = {'slug': ('name',)}
	search_fields = ('name', 'description', 'location')
	list_filter = ('is_active',)
	ordering = ('sort_order', 'name')


@admin.register(LanguageCenterApplication)
class LanguageCenterApplicationAdmin(admin.ModelAdmin):
	list_display = (
		'full_name',
		'language_center',
		'email',
		'phone_number',
		'created_at',
	)
	list_filter = ('language_center', 'created_at')
	search_fields = ('full_name', 'email', 'phone_number', 'language_center__name')
	readonly_fields = ('created_at',)
