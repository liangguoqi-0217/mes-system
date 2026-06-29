"""给所有 demo 数据 lines 中的 storageLocation 后面加上 costCenter 字段"""
FILE = r"d:\我的项目\MES系统\V3\js\pages\sp-purchase.js"
with open(FILE, "r", encoding="utf-8") as f:
    c = f.read()

# 替换 storageLocation:''} 为 storageLocation:'',costCenter:''}
c = c.replace("storageLocation:''}", "storageLocation:'',costCenter:''}")

with open(FILE, "w", encoding="utf-8") as f:
    f.write(c)

print("Done - costCenter 字段已添加到所有 demo 数据行")
