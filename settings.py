# coding=utf-8

import sys
import logging
from logging.handlers import SMTPHandler

from flask import Flask

APP_NAME = "jsondiff"


def create_app(conf=None):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(conf.JINJA_OPTIONS)
    Flask.jinja_options = jinja_options
    app = Flask(APP_NAME)
    if conf:
        app.config.from_object(conf)

    configure_extensions(app)
    configure_logging(app)
    return app


def configure_extensions(app):
    app.jinja_options['extensions'].append('jinja2.ext.do')


def configure_blueprints(app, modules):
    for module, url_prefix in modules:
        app.register_blueprint(module, url_prefix=url_prefix)
    return app


def configure_logging(app):
    mail_handler = SMTPHandler(
        app.config['MAIL_SERVER'],
        app.config['DEFAULT_MAIL_SENDER'],
        app.config['ADMINS'],
        '[jsondiff]application error',
        (
            app.config.get('MAIL_USERNAME'),
            app.config.get('MAIL_PASSWORD'),
        )
    )
    mail_formater = logging.Formatter("%(asctime)s %(levelname)s %(pathname)s %(lineno)d\n%(message)s")
    mail_handler.setFormatter(mail_formater)
    mail_handler.setLevel(logging.ERROR)
    if not app.debug:
        app.logger.addHandler(mail_handler)
    formatter = logging.Formatter("%(asctime)s %(levelname)s %(pathname)s %(lineno)d - %(message)s")
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    console_handler.setLevel(getattr(logging, app.config['LOG_LEVEL']))
    app.logger.addHandler(console_handler)
    app.logger.setLevel(getattr(logging, app.config['LOG_LEVEL']))