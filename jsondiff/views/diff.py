#coding:utf8

from flask import current_app, Blueprint, render_template, jsonify

diff = Blueprint('diff', __name__)

def logger():
    return current_app.logger


@diff.route('/')
@diff.route('/index')
def index():
    a = "qwer"
    return render_template('diff.html', a=a)


@diff.route('/compare')
def compare():

    return jsonify()


