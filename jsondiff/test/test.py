# coding=utf-8

import json_diff
from StringIO import StringIO
import json

if __name__ == '__main__':
    str1 = '{"fixedDataStruct":"wandacredit","resultCode":"10000","resultMessage":"处理失败","dataMap":{"errorMessage":"session过期,请使用refreshToken更新","errorDisplay":8,"errorCode":"5001"}}'
    str2 = '{"fixedDataStruct":"wandacredit","resultCode":"10000","resultMessage":"处理失败","dataMap":{"errorMessage":"session过期,请使用refreshToken更新2","errorDisplay":8,"errorCode":"5001"}}'
    # print json.loads(str1)
    diffator = json_diff.Comparator(StringIO(str1), StringIO(str2))
    print diffator