from django.conf.urls import patterns, include, url
from todo_list.views import *
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'todolist.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', index),
    url(r'^ajax/', ajax),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^(?P<uid>\w{8}-\w{4}-\w{4}-\w{4}-\w{12})', list)
)
