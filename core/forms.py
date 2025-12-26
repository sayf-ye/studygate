from django import forms

from .models import ContactMessage, LanguageCenterApplication


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'country', 'major', 'message']
        widgets = {
            'message': forms.Textarea(attrs={'rows': 5}),
        }

    def clean_phone(self):
        phone = self.cleaned_data['phone']
        if len(phone) < 6:
            raise forms.ValidationError('يرجى إدخال رقم هاتف صحيح')
        return phone


class LanguageCenterApplicationForm(forms.ModelForm):
    class Meta:
        model = LanguageCenterApplication
        exclude = ('language_center', 'created_at')

    def clean_accept_terms(self):
        accepted = self.cleaned_data.get('accept_terms')
        if not accepted:
            raise forms.ValidationError('يجب الموافقة على الشروط قبل الإرسال')
        return accepted
