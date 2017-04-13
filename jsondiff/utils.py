# coding=utf-8

from StringIO import StringIO
import json_diff
import json


def compare_json():
    diffator = json_diff.Comparator(StringIO('{"a": true}'), StringIO('{"a": false}'))
    diff = ("\n".join([line.strip()
                       for line in unicode(
            json_diff.HTMLFormatter(diffator.compare_dicts())).
                      split("\n")])).strip()
    return diff