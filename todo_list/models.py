# -*- coding: utf-8 -*-

from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=500, verbose_name='Название')
    done = models.BooleanField(verbose_name='Выполнена')
    parent =  models.ForeignKey('Task', blank=True, null=True, verbose_name="Родительская задача")

    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'

    def __unicode__(self):
        return self.title

    def get_children(self):
        return Task.objects.filter(parent=self)