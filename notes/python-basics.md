# Python 基础速查（面向 JS/TS 开发者）

> 本文档记录 Python 常用语法和 JS 对照，遇到新语法时持续更新

---

## 1. 装饰器（Decorator）

### Python
```python
@app.get("/health")
async def health_check():
    return {"ok": True}

# 等价于
def health_check():
    return {"ok": True}
health_check = app.get("/health")(health_check)
```

### JS 类比
```javascript
// 类似高阶函数
function route(path) {
  return function(fn) {
    app.register(path, fn);
    return fn;
  }
}

@route("/health")
function healthCheck() {
  return { ok: true };
}
```

### 常见用途
- 路由注册：`@app.get()`
- 上下文管理：`@asynccontextmanager`
- 缓存：`@lru_cache`

---

## 2. 类型注解（Type Hints）

### Python
```python
def greet(name: str) -> str:
    return f"Hello {name}"

# 复杂类型
from typing import List, Dict, Optional

def process(items: List[str]) -> Dict[str, int]:
    return {item: len(item) for item in items}

def find(id: Optional[int] = None) -> str:
    return "found" if id else "not found"
```

### JS/TS 类比
```typescript
function greet(name: string): string {
  return `Hello ${name}`;
}

function process(items: string[]): Record<string, number> {
  return items.reduce((acc, item) => ({
    ...acc, [item]: item.length
  }), {});
}

function find(id?: number): string {
  return id ? "found" : "not found";
}
```

### 关键差异
- Python 类型注解是**可选的**（运行时不强制）
- 需要用 `mypy` 或 IDE 做静态检查
- Pydantic 可以做运行时校验

---

## 3. async/await

### Python
```python
async def fetch_data():
    await asyncio.sleep(1)
    return "data"

# 运行
import asyncio
result = asyncio.run(fetch_data())
```

### JS 类比
```javascript
async function fetchData() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return "data";
}

// 运行
const result = await fetchData();
```

### 关键差异
- Python 需要 `asyncio.run()` 启动事件循环
- FastAPI 自动处理，你只需要写 `async def`

---

## 4. 字典（dict）

### Python
```python
# 创建
user = {"name": "Alice", "age": 25}

# 访问
user["name"]           # "Alice"
user.get("email", "")  # 默认值

# 遍历
for key, value in user.items():
    print(f"{key}: {value}")

# 字典推导式
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

### JS 类比
```javascript
// 创建
const user = { name: "Alice", age: 25 };

// 访问
user.name;              // "Alice"
user.email || "";       // 默认值

// 遍历
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// 类似字典推导式
const squares = Object.fromEntries(
  Array.from({length: 5}, (_, x) => [x, x**2])
);
```

### 关键差异
- Python 用 `[]` 访问，JS 用 `.` 或 `[]`
- Python 的 `.get()` 有默认值，JS 需要 `||` 或 `??`

---

## 5. 列表（list）

### Python
```python
# 创建
nums = [1, 2, 3, 4, 5]

# 常用操作
nums.append(6)         # 添加
nums[0]                # 访问
nums[1:3]              # 切片 [2, 3]
len(nums)              # 长度

# 列表推导式
squares = [x**2 for x in nums]
evens = [x for x in nums if x % 2 == 0]
```

### JS 类比
```javascript
// 创建
const nums = [1, 2, 3, 4, 5];

// 常用操作
nums.push(6);          // 添加
nums[0];               // 访问
nums.slice(1, 3);      // 切片 [2, 3]
nums.length;           // 长度

// 类似列表推导式
const squares = nums.map(x => x**2);
const evens = nums.filter(x => x % 2 === 0);
```

---

## 6. 字符串格式化

### Python
```python
name = "Alice"
age = 25

# f-string（推荐）
msg = f"Hello {name}, you are {age}"

# format
msg = "Hello {}, you are {}".format(name, age)

# % 格式化（旧式）
msg = "Hello %s, you are %d" % (name, age)
```

### JS 类比
```javascript
const name = "Alice";
const age = 25;

// 模板字符串
const msg = `Hello ${name}, you are ${age}`;
```

---

## 7. 类（Class）

### Python
```python
class User:
    def __init__(self, name: str):
        self.name = name
    
    def greet(self):
        return f"Hello {self.name}"

user = User("Alice")
user.greet()  # "Hello Alice"
```

### JS 类比
```javascript
class User {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello ${this.name}`;
  }
}

const user = new User("Alice");
user.greet();  // "Hello Alice"
```

### 关键差异
- Python 用 `__init__` 代替 `constructor`
- Python 方法第一个参数必须是 `self`（类似 JS 的 `this`）

---

## 8. 导入（import）

### Python
```python
# 导入整个模块
import os
os.path.join("a", "b")

# 导入特定函数
from os.path import join
join("a", "b")

# 导入并重命名
from fastapi import FastAPI as App

# 导入所有（不推荐）
from os.path import *
```

### JS 类比
```javascript
// CommonJS
const os = require('os');
const { join } = require('path');

// ES6
import os from 'os';
import { join } from 'path';
import { FastAPI as App } from 'fastapi';
```

---

## 9. 异常处理

### Python
```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"Unknown error: {e}")
finally:
    print("Cleanup")
```

### JS 类比
```javascript
try {
  const result = 10 / 0;
} catch (e) {
  if (e instanceof ZeroDivisionError) {
    console.log(`Error: ${e}`);
  } else {
    console.log(`Unknown error: ${e}`);
  }
} finally {
  console.log("Cleanup");
}
```

---

## 10. 上下文管理器（with）

### Python
```python
# 自动关闭文件
with open("file.txt", "r") as f:
    content = f.read()
# 离开 with 块后自动调用 f.close()

# 自定义上下文管理器
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    print("启动")
    yield
    print("关闭")
```

### JS 类比
```javascript
// 没有直接对应，类似 try...finally
const f = fs.openSync("file.txt", "r");
try {
  const content = fs.readFileSync(f);
} finally {
  fs.closeSync(f);
}
```

---

## 常用内置函数速查

| Python | JS 类比 | 说明 |
|--------|---------|------|
| `len(list)` | `list.length` | 长度 |
| `range(5)` | `Array.from({length: 5}, (_, i) => i)` | 生成序列 |
| `enumerate(list)` | `list.map((v, i) => [i, v])` | 带索引遍历 |
| `zip(a, b)` | `a.map((v, i) => [v, b[i]])` | 合并列表 |
| `any([...])` | `[...].some(x => x)` | 任意为真 |
| `all([...])` | `[...].every(x => x)` | 全部为真 |

---

## 下次遇到新语法时

1. 在这个文件里添加新的章节
2. 写清楚 Python 代码 + JS 类比
3. 标注关键差异和坑点


---

## 11. 生成器（Generator）

### Python
```python
# 用 yield 创建生成器
def count_up_to(n):
    i = 0
    while i < n:
        yield i
        i += 1

# 使用
for num in count_up_to(5):
    print(num)  # 0, 1, 2, 3, 4

# 生成器表达式
squares = (x**2 for x in range(5))
```

### JS 类比
```javascript
// Generator
function* countUpTo(n) {
  let i = 0;
  while (i < n) {
    yield i;
    i++;
  }
}

for (const num of countUpTo(5)) {
  console.log(num);
}
```

### 用途
- 节省内存（不一次性生成所有数据）
- SSE 流式输出（Day2 会用到）
- 处理大文件（逐行读取）

---

## 12. Lambda 函数（匿名函数）

### Python
```python
# lambda 语法
add = lambda x, y: x + y
add(2, 3)  # 5

# 常用于 map/filter/sorted
nums = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x**2, nums))
evens = list(filter(lambda x: x % 2 == 0, nums))
sorted_users = sorted(users, key=lambda u: u['age'])
```

### JS 类比
```javascript
// 箭头函数
const add = (x, y) => x + y;
add(2, 3);  // 5

// 常用于 map/filter/sort
const nums = [1, 2, 3, 4, 5];
const squares = nums.map(x => x**2);
const evens = nums.filter(x => x % 2 === 0);
const sortedUsers = users.sort((a, b) => a.age - b.age);
```

### 关键差异
- Python lambda 只能写一行表达式
- 复杂逻辑用 `def` 定义函数

---

## 13. *args 和 **kwargs（可变参数）

### Python
```python
# *args：接收任意数量的位置参数
def sum_all(*args):
    return sum(args)

sum_all(1, 2, 3, 4)  # 10

# **kwargs：接收任意数量的关键字参数
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25)
# name: Alice
# age: 25

# 组合使用
def func(a, b, *args, **kwargs):
    print(f"a={a}, b={b}")
    print(f"args={args}")
    print(f"kwargs={kwargs}")

func(1, 2, 3, 4, x=5, y=6)
# a=1, b=2
# args=(3, 4)
# kwargs={'x': 5, 'y': 6}
```

### JS 类比
```javascript
// Rest parameters
function sumAll(...args) {
  return args.reduce((a, b) => a + b, 0);
}

sumAll(1, 2, 3, 4);  // 10

// 对象解构
function printInfo(options) {
  Object.entries(options).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
}

printInfo({ name: "Alice", age: 25 });
```

---

## 14. 解包（Unpacking）

### Python
```python
# 列表解包
a, b, c = [1, 2, 3]

# 字典解包
user = {"name": "Alice", "age": 25}
print(**user)  # 等价于 print(name="Alice", age=25)

# * 解包列表
nums = [1, 2, 3]
print(*nums)  # 等价于 print(1, 2, 3)

# ** 解包字典
def greet(name, age):
    return f"Hello {name}, {age}"

user = {"name": "Alice", "age": 25}
greet(**user)  # 等价于 greet(name="Alice", age=25)
```

### JS 类比
```javascript
// 数组解构
const [a, b, c] = [1, 2, 3];

// 对象解构
const user = { name: "Alice", age: 25 };
const { name, age } = user;

// Spread operator
const nums = [1, 2, 3];
console.log(...nums);  // 1 2 3

const user = { name: "Alice", age: 25 };
greet({ ...user });
```

---

## 15. 列表/字典推导式（进阶）

### Python
```python
# 嵌套列表推导式
matrix = [[1, 2, 3], [4, 5, 6]]
flat = [num for row in matrix for num in row]
# [1, 2, 3, 4, 5, 6]

# 带条件的字典推导式
users = [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 17}
]
adults = {u["name"]: u["age"] for u in users if u["age"] >= 18}
# {"Alice": 25}

# 集合推导式
unique_chars = {c for c in "hello"}
# {'h', 'e', 'l', 'o'}
```

### JS 类比
```javascript
// 嵌套 flatMap
const matrix = [[1, 2, 3], [4, 5, 6]];
const flat = matrix.flatMap(row => row);
// [1, 2, 3, 4, 5, 6]

// 带条件的对象
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 }
];
const adults = Object.fromEntries(
  users.filter(u => u.age >= 18).map(u => [u.name, u.age])
);
// { Alice: 25 }

// Set
const uniqueChars = new Set("hello");
// Set { 'h', 'e', 'l', 'o' }
```

---

## 16. 切片（Slicing）

### Python
```python
nums = [0, 1, 2, 3, 4, 5]

# 基本切片
nums[1:4]      # [1, 2, 3]（索引 1 到 3）
nums[:3]       # [0, 1, 2]（开头到索引 2）
nums[3:]       # [3, 4, 5]（索引 3 到结尾）
nums[:]        # [0, 1, 2, 3, 4, 5]（复制整个列表）

# 步长
nums[::2]      # [0, 2, 4]（每隔一个）
nums[1::2]     # [1, 3, 5]
nums[::-1]     # [5, 4, 3, 2, 1, 0]（反转）

# 负索引
nums[-1]       # 5（最后一个）
nums[-3:]      # [3, 4, 5]（最后 3 个）
```

### JS 类比
```javascript
const nums = [0, 1, 2, 3, 4, 5];

// 基本切片
nums.slice(1, 4);     // [1, 2, 3]
nums.slice(0, 3);     // [0, 1, 2]
nums.slice(3);        // [3, 4, 5]
nums.slice();         // [0, 1, 2, 3, 4, 5]

// 步长（需要手动实现）
nums.filter((_, i) => i % 2 === 0);  // [0, 2, 4]
nums.reverse();       // [5, 4, 3, 2, 1, 0]

// 负索引
nums[nums.length - 1];  // 5
nums.slice(-3);         // [3, 4, 5]
```

---

## 17. 多重赋值和交换

### Python
```python
# 多重赋值
x, y = 1, 2

# 交换变量（不需要临时变量）
x, y = y, x

# 忽略某些值
a, _, c = [1, 2, 3]  # a=1, c=3

# 收集剩余值
first, *rest = [1, 2, 3, 4]
# first=1, rest=[2, 3, 4]
```

### JS 类比
```javascript
// 多重赋值
let [x, y] = [1, 2];

// 交换变量
[x, y] = [y, x];

// 忽略某些值
const [a, , c] = [1, 2, 3];  // a=1, c=3

// Rest operator
const [first, ...rest] = [1, 2, 3, 4];
// first=1, rest=[2, 3, 4]
```

---

## 18. 三元表达式

### Python
```python
# 语法：value_if_true if condition else value_if_false
age = 20
status = "adult" if age >= 18 else "minor"

# 嵌套（不推荐，可读性差）
score = 85
grade = "A" if score >= 90 else "B" if score >= 80 else "C"
```

### JS 类比
```javascript
// 三元运算符
const age = 20;
const status = age >= 18 ? "adult" : "minor";

// 嵌套
const score = 85;
const grade = score >= 90 ? "A" : score >= 80 ? "B" : "C";
```

---

## 19. None、True、False

### Python
```python
# None（类似 JS 的 null）
value = None
if value is None:
    print("No value")

# 布尔值（首字母大写）
is_active = True
is_deleted = False

# 真值测试
if []:        # False（空列表）
if {}:        # False（空字典）
if "":        # False（空字符串）
if 0:         # False
if None:      # False

# 所有其他值都是 True
if [1]:       # True
if "hello":   # True
```

### JS 类比
```javascript
// null/undefined
let value = null;
if (value === null) {
  console.log("No value");
}

// 布尔值（小写）
const isActive = true;
const isDeleted = false;

// 假值
if ([]) {}        // True（JS 的空数组是真值！）
if ({}) {}        // True（JS 的空对象是真值！）
if ("") {}        // False
if (0) {}         // False
if (null) {}      // False
if (undefined) {} // False
```

### 关键差异
- Python 的空列表/字典是假值，JS 是真值
- Python 用 `is None`，JS 用 `=== null`

---

## 20. 文件操作

### Python
```python
# 读取文件
with open("file.txt", "r") as f:
    content = f.read()

# 逐行读取
with open("file.txt", "r") as f:
    for line in f:
        print(line.strip())

# 写入文件
with open("file.txt", "w") as f:
    f.write("Hello\n")

# 追加
with open("file.txt", "a") as f:
    f.write("World\n")

# 读取 JSON
import json
with open("data.json", "r") as f:
    data = json.load(f)

# 写入 JSON
with open("data.json", "w") as f:
    json.dump({"key": "value"}, f, indent=2)
```

### JS 类比
```javascript
// Node.js
const fs = require('fs');

// 读取文件
const content = fs.readFileSync("file.txt", "utf-8");

// 逐行读取
const lines = content.split('\n');
lines.forEach(line => console.log(line));

// 写入文件
fs.writeFileSync("file.txt", "Hello\n");

// 追加
fs.appendFileSync("file.txt", "World\n");

// 读取 JSON
const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

// 写入 JSON
fs.writeFileSync("data.json", JSON.stringify({ key: "value" }, null, 2));
```

---

## 21. 环境变量

### Python
```python
import os

# 读取环境变量
api_key = os.getenv("API_KEY")
api_key = os.getenv("API_KEY", "default_value")  # 带默认值

# 设置环境变量
os.environ["API_KEY"] = "xxx"

# 检查是否存在
if "API_KEY" in os.environ:
    print("Key exists")
```

### JS 类比
```javascript
// Node.js
const apiKey = process.env.API_KEY;
const apiKey = process.env.API_KEY || "default_value";

// 设置
process.env.API_KEY = "xxx";

// 检查
if ("API_KEY" in process.env) {
  console.log("Key exists");
}
```

---

## 22. 路径操作

### Python
```python
import os
from pathlib import Path

# os.path（旧式）
path = os.path.join("folder", "file.txt")
exists = os.path.exists(path)
dirname = os.path.dirname(path)
basename = os.path.basename(path)

# pathlib（推荐）
path = Path("folder") / "file.txt"
exists = path.exists()
parent = path.parent
name = path.name
stem = path.stem  # 不带扩展名
suffix = path.suffix  # 扩展名

# 创建目录
Path("folder").mkdir(parents=True, exist_ok=True)
```

### JS 类比
```javascript
// Node.js
const path = require('path');
const fs = require('fs');

// 路径操作
const filePath = path.join("folder", "file.txt");
const exists = fs.existsSync(filePath);
const dirname = path.dirname(filePath);
const basename = path.basename(filePath);

// 创建目录
fs.mkdirSync("folder", { recursive: true });
```

---

## 23. 时间日期

### Python
```python
from datetime import datetime, timedelta

# 当前时间
now = datetime.now()
print(now.strftime("%Y-%m-%d %H:%M:%S"))

# 解析时间
dt = datetime.strptime("2026-02-05", "%Y-%m-%d")

# 时间运算
tomorrow = now + timedelta(days=1)
one_hour_ago = now - timedelta(hours=1)

# 时间戳
timestamp = now.timestamp()
dt_from_timestamp = datetime.fromtimestamp(timestamp)
```

### JS 类比
```javascript
// 当前时间
const now = new Date();
console.log(now.toISOString());

// 解析时间
const dt = new Date("2026-02-05");

// 时间运算
const tomorrow = new Date(now.getTime() + 24*60*60*1000);
const oneHourAgo = new Date(now.getTime() - 60*60*1000);

// 时间戳
const timestamp = now.getTime() / 1000;
const dtFromTimestamp = new Date(timestamp * 1000);
```

---

## 24. 正则表达式

### Python
```python
import re

# 匹配
match = re.search(r"\d+", "abc123def")
if match:
    print(match.group())  # "123"

# 查找所有
numbers = re.findall(r"\d+", "abc123def456")
# ["123", "456"]

# 替换
text = re.sub(r"\d+", "X", "abc123def456")
# "abcXdefX"

# 分割
parts = re.split(r"\s+", "hello  world")
# ["hello", "world"]
```

### JS 类比
```javascript
// 匹配
const match = "abc123def".match(/\d+/);
if (match) {
  console.log(match[0]);  // "123"
}

// 查找所有
const numbers = "abc123def456".match(/\d+/g);
// ["123", "456"]

// 替换
const text = "abc123def456".replace(/\d+/g, "X");
// "abcXdefX"

// 分割
const parts = "hello  world".split(/\s+/);
// ["hello", "world"]
```

---

## 25. 常用标准库速查

| 功能 | Python | JS 类比 |
|------|--------|---------|
| HTTP 请求 | `import requests` | `fetch()` / `axios` |
| JSON | `import json` | `JSON.parse/stringify` |
| 随机数 | `import random` | `Math.random()` |
| 时间 | `import time` | `Date.now()` |
| 正则 | `import re` | `/regex/` |
| 路径 | `from pathlib import Path` | `require('path')` |
| 环境变量 | `import os` | `process.env` |
| 命令行参数 | `import sys; sys.argv` | `process.argv` |

---

## 下次遇到新语法时

1. 在这个文件里添加新的章节
2. 写清楚 Python 代码 + JS 类比
3. 标注关键差异和坑点
