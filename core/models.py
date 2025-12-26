from django.db import models


class Post(models.Model):
	title = models.CharField(max_length=255)
	slug = models.SlugField(unique=True)
	excerpt = models.TextField()
	content = models.TextField()
	category = models.CharField(max_length=100, blank=True)
	hero_image = models.ImageField(upload_to='posts/', blank=True, null=True)
	published_at = models.DateField()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['-published_at']

	def __str__(self):
		return self.title


class University(models.Model):
	name = models.CharField(max_length=255)
	slug = models.SlugField(unique=True)
	description = models.CharField(max_length=300, blank=True)
	location = models.CharField(max_length=255, blank=True)
	website = models.URLField(blank=True)
	logo = models.ImageField(upload_to='partners/universities/', blank=True, null=True)
	sort_order = models.PositiveIntegerField(default=0)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['sort_order', 'name']

	def __str__(self):
		return self.name


class LanguageCenter(models.Model):
	name = models.CharField(max_length=255)
	slug = models.SlugField(unique=True)
	description = models.CharField(max_length=300, blank=True)
	about = models.TextField(blank=True)
	features = models.TextField(blank=True, help_text="HTML list or paragraphs for features")
	programs = models.TextField(blank=True, help_text="HTML content for programs")
	fees = models.TextField(blank=True, help_text="HTML table/description for fees")
	location_info = models.TextField(blank=True, help_text="HTML content for location/hours")
	location = models.CharField(max_length=255, blank=True)
	website = models.URLField(blank=True)
	logo = models.ImageField(upload_to='partners/language-centers/', blank=True, null=True)
	detail_url = models.URLField(blank=True, help_text="Optional link to detail page")
	sort_order = models.PositiveIntegerField(default=0)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['sort_order', 'name']

	def __str__(self):
		return self.name


class LanguageCenterApplication(models.Model):
	language_center = models.ForeignKey(LanguageCenter, on_delete=models.CASCADE, related_name='applications')
	full_name = models.CharField(max_length=255)
	nationality = models.CharField(max_length=100)
	country_of_residence = models.CharField(max_length=150)
	study_duration = models.PositiveIntegerField(help_text="Number of months")
	email = models.EmailField()
	country_code = models.CharField(max_length=10)
	phone_number = models.CharField(max_length=30)
	passport_photo = models.FileField(upload_to='applications/passport/')
	personal_photo = models.FileField(upload_to='applications/personal/')
	high_school_certificate = models.FileField(upload_to='applications/certificates/')
	accept_terms = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"{self.full_name} - {self.language_center.name}"


class ContactMessage(models.Model):
	name = models.CharField(max_length=150)
	email = models.EmailField()
	phone = models.CharField(max_length=50)
	country = models.CharField(max_length=100)
	major = models.CharField(max_length=150)
	message = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"{self.name} - {self.email}"

# Create your models here.
