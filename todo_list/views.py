# -*- coding: utf-8 -*-

from django.shortcuts import render
from django.http import HttpResponse
from todo_list.models import *
import json


def index(request):
    tasks = Task.objects.filter(parent=None)

    return render(request, 'index.html', {'tasks': tasks})


def error(text):
    return HttpResponse(json.dumps({'Error': text}), content_type='application/json')


def rsp(data):
    return HttpResponse(json.dumps({'Data': data}), content_type='application/json')


def ajax(request):
    try:
        req = json.loads(request.body)

        try:
            method = req['Method']
        except Exception:
            return error('Method missed')

        try:
            param = req['Param']
        except Exception:
            return error('Param missed')

        if method == "Add":
            try:
                task_title = param['task_title']

                if task_title == "":
                    error('Task title is empty')

            except Exception:
                return error('task_title missed')

            try:
                parent_id = param['parent']
                parent = None

                try:
                    if parent_id:
                        parent = Task.objects.get(id=parent_id)
                except:
                    return error('Wrong parent')
            except Exception:
                return error('parent missed')

            task = Task()
            task.title = task_title
            task.parent = parent
            task.save()

            return rsp({'task_id': task.id, 'parent': parent_id})
        elif method == "Check":
            try:
                task_id = param['task_id']
            except Exception:
                return error('task_id missed')

            try:
                task = Task.objects.get(id=task_id)
            except Exception:
                return error('Task not found')

            task.done = True
            task.save()

            return rsp(True)
        else:
            return error('Wrong method name')
    except Exception:
        return error('Wrong JSON')
