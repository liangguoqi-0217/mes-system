"""删除所有 demo 数据中的 wbsNo 和 purpose 字段"""
FILE = r"d:\我的项目\MES系统\V3\js\pages\sp-purchase.js"
with open(FILE, "r", encoding="utf-8") as f:
    c = f.read()

import re

# 删除 wbsNo:'...', 这种模式（整行或行的一部分）
# 匹配 pattern: wbsNo:'任意内容', 或 wbsNo:''，后面可能有逗号
c = re.sub(r"\s*wbsNo:'[^']*',\s*", "", c)
c = re.sub(r'\s*wbsNo:"[^"]*",\s*', "", c)

# 删除 purpose:'...', 这种模式
c = re.sub(r"\s*purpose:'[^']*',\s*", "", c)
c = re.sub(r'\s*purpose:"[^"]*",\s*', "", c)

with open(FILE, "w", encoding="utf-8") as f:
    f.write(c)

print("Done - wbsNo 和 purpose 字段已从所有 demo 数据中删除")
