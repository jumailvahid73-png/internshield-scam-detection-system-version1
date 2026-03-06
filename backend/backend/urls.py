from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.check_internship, name="check_internship"),
    path("internship/<int:internship_id>/", views.internship_detail, name="internship_detail"),
    path("report/<int:internship_id>/", views.report_internship, name="report_internship"),
    path("analytics/", views.analytics_dashboard, name="analytics_dashboard"),
]