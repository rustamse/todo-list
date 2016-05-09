#-*- coding: utf-8 -*-
from django import template
from todo_list.models import *
register = template.Library()


@register.inclusion_tag("task.html")
def get_task_children(parent):
    return {'task': parent, 'list': parent.get_children()}