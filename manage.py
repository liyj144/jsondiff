# coding=utf-8

import os
from flask import current_app
from jsondiff import config
from flask_script import Manager
from jsondiff.mountpoint import MOUNT_POINTS
from settings import create_app, configure_blueprints
from jsondiff.utils import compare_json

env = os.getenv('APP_ENV')
if not env:
    env = "Development"
cfg = getattr(config, '%sConfig' % env)
if not cfg:
    raise RuntimeError("can not find config for Evn %s" % env)
app = create_app(conf=cfg)
app = configure_blueprints(app, MOUNT_POINTS)
manager = Manager(app)


@manager.command
def testJsonDiff():
    str1 = '{"fixedDataStruct":"wandacredit","resultCode":"10000","resultMessage":"处理失败","dataMap":{"errorMessage":"session过期,请使用refreshToken更新","errorDisplay":8,"errorCode":"5001"}}'
    str2 = '{"fixedDataStruct":"wandacredit","resultCode":"10000","resultMessage":"处理失败","dataMap":{"errorMessage":"session过期,请使用refreshToken更新2","errorDisplay":8,"errorCode":"5001"}}'
    ret, diff = compare_json(str1, str2)
    print diff


if __name__ == '__main__':
    manager.run(default_command="runserver")