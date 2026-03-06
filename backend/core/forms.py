from django import forms
from .models import Report


class ReportForm(forms.ModelForm):

    class Meta:
        model = Report
        fields = ["reason", "details"]

        widgets = {
            "reason": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Why is this suspicious?"
                }
            ),
            "details": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "rows": 4,
                    "placeholder": "Provide more details (optional)"
                }
            )
        }
