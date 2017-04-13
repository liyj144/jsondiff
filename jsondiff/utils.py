# coding=utf-8

from StringIO import StringIO
import json_diff
import json

def change_to_str(a):
    if isinstance(a, str):
        return True, StringIO(a)
    elif isinstance(a, (dict, tuple, list, )):
        # return True, json.dumps(a, ensure_ascii=False)
        return True, json.dumps(a)
    else:
        return False, False

def compare_json(a, b):
    reta, stra = change_to_str(a)
    retb, strb = change_to_str(b)
    if not all([reta, retb]):
        return False, False
    diffator = json_diff.Comparator(stra, strb)
    return True, diffator.compare_dicts()