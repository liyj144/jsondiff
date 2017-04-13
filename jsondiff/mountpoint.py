#coding:utf-8
__author__ = 'Feng Lu'

from .views.diff import diff

MOUNT_POINTS = ((diff, "/diff"),
                (diff, "/"),
)