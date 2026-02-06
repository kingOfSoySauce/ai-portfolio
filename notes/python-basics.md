# Python 基础（面向 React 前端工程师）

## 金字塔顶层：一句话总结
**Python 是一门动态类型、解释执行的语言，语法简洁，适合快速实现 AI 应用的后端逻辑（RAG/Agent/API）。**

---

## 第一层：你需要掌握的 3 大核心能力

### 1. 基础语法与数据结构（对标 JS 基础）
- 变量、函数、控制流
- 常用数据结构：list、dict、tuple、set
- 类与对象（面向对象基础）

### 2. 异步与并发（对标 async/await）
- `async/await` 语法
- `asyncio` 事件循环
- 何时用异步（I/O 密集场景：API 调用、数据库查询）

### 3. 包管理与项目结构（对标 npm/pnpm + monorepo）
- `pip` / `uv` 安装依赖
- 虚拟环境 `venv`（对标 node_modules 隔离）
- `requirements.txt`（对标 package.json）

---

## 第二层：逐个击破（JS/TS 类比 + 最小示例）

### 1. 基础语法与数据结构

#### 1.1 变量与类型
**Python 特点**：动态类型，但可以用类型注解（类似 TS）

```python
# JS: const name = "Alice";
name: str = "Alice"  # 类型注解（可选，但推荐）

# JS: let age = 25;
age: int = 25

# JS: const isActive = true;
is_active: bool = True  # 注意：True/False 首字母大写
```

**关键差异**：
- Python 用 `True/False`，不是 `true/false`
- 变量命名推荐 `snake_case`（不是 camelCase）
- 类型注解不强制，但加上后 IDE 会提示（类似 TS）

#### 1.2 函数定义
**Python 特点**：用 `def` 定义，缩进表示代码块（不是 `{}`）

```python
# JS:
# function greet(name) {
#   return `Hello, ${name}`;
# }

def greet(name: str) -> str:
    return f"Hello, {name}"  # f-string，类似 JS 的模板字符串

# 调用
print(greet("Alice"))  # 输出：Hello, Alice
```

**关键差异**：
- 用 `def` 不是 `function`
- 用缩进（4 空格）表示代码块，不是 `{}`
- 用 `f"..."` 做字符串插值，类似 JS 的 `` `...` ``

#### 1.3 数据结构对照表

| Python 类型 | JS/TS 对应 | 说明 | 示例 |
|------------|-----------|------|------|
| `list` | `Array` | 可变数组 | `[1, 2, 3]` |
| `tuple` | 只读数组（readonly） | 不可变数组 | `(1, 2, 3)` |
| `dict` | `Object` / `Map` | 键值对 | `{"name": "Alice"}` |
| `set` | `Set` | 去重集合 | `{1, 2, 3}` |

**最小示例**：

```python
# list（类似 JS 的 Array）
fruits: list[str] = ["apple", "banana"]
fruits.append("orange")  # 类似 JS 的 push
print(fruits[0])  # 输出：apple

# dict（类似 JS 的对象）
user: dict[str, str] = {"name": "Alice", "role": "admin"}
print(user["name"])  # 输出：Alice
print(user.get("age", 18))  # 类似 JS 的 user.age ?? 18

# list comprehension（类似 JS 的 map/filter 组合）
# JS: const doubled = [1, 2, 3].map(x => x * 2);
doubled: list[int] = [x * 2 for x in [1, 2, 3]]
print(doubled)  # 输出：[2, 4, 6]
```

**你会在哪里用到**：
- `list`：存储文档切块、检索结果
- `dict`：配置对象、API 响应体
- list comprehension：批量处理数据（如过滤、转换）

#### 1.4 类与对象（面向对象基础）
**Python 特点**：用 `class` 定义，`__init__` 是构造函数

```python
# JS:
# class User {
#   constructor(name, age) {
#     this.name = name;
#     this.age = age;
#   }
#   greet() {
#     return `Hi, I'm ${this.name}`;
#   }
# }

class User:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age
    
    def greet(self) -> str:
        return f"Hi, I'm {self.name}"

# 使用
user = User("Alice", 25)
print(user.greet())  # 输出：Hi, I'm Alice
```

**关键差异**：
- 构造函数叫 `__init__`（不是 `constructor`）
- 方法第一个参数必须是 `self`（类似 JS 的 `this`，但要显式写出来）
- 没有 `new` 关键字，直接调用类名

**你会在哪里用到**：
- 封装 RAG 组件（如 `VectorStore`、`Retriever`）
- 定义配置类（用 `pydantic` 做校验）

---

### 2. 异步与并发

#### 2.1 async/await 语法
**Python 特点**：语法类似 JS，但运行机制不同（需要事件循环）

```python
import asyncio

# JS:
# async function fetchData() {
#   const response = await fetch("https://api.example.com");
#   return response.json();
# }

async def fetch_data() -> dict:
    await asyncio.sleep(1)  # 模拟异步操作（类似 setTimeout）
    return {"status": "ok"}

# 运行异步函数（关键差异！）
# JS 可以直接 await，Python 需要事件循环
result = asyncio.run(fetch_data())
print(result)  # 输出：{'status': 'ok'}
```

**关键差异**：
- Python 的 `async/await` 必须在事件循环中运行（用 `asyncio.run()`）
- JS 的 `await` 可以在顶层直接用（Node.js 14+），Python 不行

#### 2.2 何时用异步？
**规则**：I/O 密集场景（网络请求、数据库查询、文件读写）

```python
# 场景：同时调用多个 LLM API
async def call_llm(prompt: str) -> str:
    # 模拟 API 调用
    await asyncio.sleep(1)
    return f"Response to: {prompt}"

async def batch_call():
    # 并发调用 3 次（类似 Promise.all）
    results = await asyncio.gather(
        call_llm("Question 1"),
        call_llm("Question 2"),
        call_llm("Question 3"),
    )
    return results

# 运行
results = asyncio.run(batch_call())
print(results)
```

**你会在哪里用到**：
- RAG 检索时并发查询多个数据源
- Agent 并发调用多个工具
- FastAPI 的异步路由（`async def` 路由函数）

---

### 3. 包管理与项目结构

#### 3.1 虚拟环境（对标 node_modules）
**为什么需要**：隔离项目依赖，避免全局污染

```bash
# 创建虚拟环境（类似 npm init）
python -m venv .venv

# 激活虚拟环境
# macOS/Linux:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# 安装依赖（类似 npm install）
pip install fastapi uvicorn

# 导出依赖列表（类似 package.json）
pip freeze > requirements.txt

# 安装依赖（类似 npm install）
pip install -r requirements.txt
```

**你会在哪里用到**：
- 每个项目都要创建独立虚拟环境
- `projects/rag-kb/backend/.venv` 就是你的虚拟环境

#### 3.2 requirements.txt（对标 package.json）
**格式**：每行一个包，可以指定版本

```txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
openai==1.54.0
python-dotenv==1.0.0
```

**关键差异**：
- 没有 `devDependencies`，所有依赖都在一起
- 版本号用 `==`（精确）或 `>=`（最低版本）

---

## 第三层：实战检查清单（你现在要做什么）

### 立即验证（5 分钟）
在你的 `projects/rag-kb/backend/` 目录下：

1. **创建虚拟环境**：
```bash
cd projects/rag-kb/backend
python -m venv .venv
source .venv/bin/activate  # macOS
```

2. **写一个最小 Python 脚本**（`test_basics.py`）：
```python
# 测试：变量、函数、list、dict
def process_docs(docs: list[str]) -> dict:
    return {
        "count": len(docs),
        "first": docs[0] if docs else None
    }

docs = ["doc1.txt", "doc2.txt"]
result = process_docs(docs)
print(result)  # 应该输出：{'count': 2, 'first': 'doc1.txt'}
```

3. **运行**：
```bash
python test_basics.py
```

### 复现检查（24 小时内）
不看这份笔记，尝试：
- [ ] 写一个函数，接收 `list[dict]`，返回过滤后的结果
- [ ] 用 list comprehension 实现（类似 JS 的 `filter + map`）
- [ ] 写一个类，封装配置（name、api_key）

---

## 第四层：常见坑与面试要点

### 坑 1：缩进错误
**问题**：Python 用缩进表示代码块，混用空格和 Tab 会报错

**解决**：
- 统一用 4 空格（不要用 Tab）
- VSCode 设置：`"editor.tabSize": 4`，`"editor.insertSpaces": true`

### 坑 2：可变默认参数
**问题**：
```python
def add_item(item, items=[]):  # 危险！
    items.append(item)
    return items

print(add_item(1))  # [1]
print(add_item(2))  # [1, 2]  ← 预期是 [2]，但默认参数被复用了
```

**解决**：
```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### 坑 3：字典键不存在
**问题**：
```python
user = {"name": "Alice"}
print(user["age"])  # KeyError
```

**解决**：
```python
print(user.get("age", 18))  # 类似 JS 的 user.age ?? 18
```

### 面试要点
**问题**：Python 的 list 和 tuple 有什么区别？
**答案**：
- list 可变（可 append、修改），tuple 不可变
- tuple 更轻量，适合做函数返回值、字典的键
- 类似 JS 的 `const arr = []`（可变）vs `const arr = Object.freeze([])`（不可变）

---

## 下一步
- [ ] 完成"立即验证"的 3 个步骤
- [ ] 阅读 `projects/rag-kb/backend/app/main.py`，看看 FastAPI 怎么用
- [ ] 下一篇笔记：《FastAPI 快速上手（对标 Express.js）》

---

## 参考资料
- [Python 官方教程（中文）](https://docs.python.org/zh-cn/3/tutorial/)
- [Real Python（实战教程）](https://realpython.com/)
- 你的仓库：`playground/` 目录可以随时做小实验
