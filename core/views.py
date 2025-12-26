from django.contrib import messages
from django.shortcuts import get_object_or_404, render
from django.views.generic import TemplateView, ListView, DetailView

from .forms import ContactForm, LanguageCenterApplicationForm
from .models import LanguageCenter, Post, University


class HomeView(TemplateView):
	template_name = 'index.html'


class AboutView(TemplateView):
	template_name = 'about.html'


class ServicesView(TemplateView):
	template_name = 'services.html'


class PartnersView(TemplateView):
	template_name = 'partners.html'

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)
		context['universities'] = University.objects.filter(is_active=True).order_by('sort_order', 'name')
		context['language_centers'] = LanguageCenter.objects.filter(is_active=True).order_by('sort_order', 'name')
		return context


class LanguageCenterDetailView(DetailView):
	model = LanguageCenter
	template_name = 'language_center_detail.html'
	context_object_name = 'center'
	slug_field = 'slug'
	slug_url_kwarg = 'slug'

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)
		context['form'] = kwargs.get('form', LanguageCenterApplicationForm())
		context['success'] = kwargs.get('success', False)
		return context

	def post(self, request, *args, **kwargs):
		self.object = self.get_object()
		form = LanguageCenterApplicationForm(request.POST, request.FILES)
		success = False
		if form.is_valid():
			application = form.save(commit=False)
			application.language_center = self.object
			application.save()
			success = True
			form = LanguageCenterApplicationForm()
		return self.render_to_response(self.get_context_data(form=form, success=success))


class BlogListView(ListView):
	model = Post
	template_name = 'blog_list.html'
	context_object_name = 'posts'


class BlogDetailView(DetailView):
	model = Post
	template_name = 'blog_detail.html'
	context_object_name = 'post'
	slug_field = 'slug'
	slug_url_kwarg = 'slug'

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)
		context['related_posts'] = Post.objects.exclude(pk=self.object.pk)[:3]
		return context


def contact_view(request):
	form = ContactForm(request.POST or None)
	success = False

	if request.method == 'POST' and form.is_valid():
		form.save()
		success = True
		messages.success(request, 'تم استلام رسالتك وسنتواصل معك قريباً.')
		form = ContactForm()  # Reset form

	return render(request, 'contact.html', {
		'form': form,
		'success': success,
	})
