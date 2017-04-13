#coding:utf-8

import os

__author__ = 'yanjie'


class Config(object):
    LOG_LEVEL = "DEBUG"
    STATIC_URL_PATH = "/dbsearch/static"
    STATIC_FOLDER = "static"
    TEMPLATE_FOLDER = "templates"
    MODEL_RESULT_FILTER = False
    JINJA_OPTIONS = dict(
        variable_start_string='{[',
        variable_end_string=']}'
    )


class DevelopmentConfig(Config):
    DEBUG = True
    MAIL_SUFFIX = 'mail.163.com'
    MAIL_SERVER = 'smtp.163.com'
    MAIL_PORT = 25
    MAIL_USE_TLS = False
    MAIL_USE_SSL = False
    MAIL_DEBUG = False
    MAIL_USERNAME = 'lyjtes3@163.com'
    MAIL_PASSWORD = 'intsig'
    DEFAULT_MAIL_SENDER = 'lyjtes3@163.com'

    ADMINS = ('liyj144@163.com',)
