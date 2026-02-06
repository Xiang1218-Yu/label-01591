# Excel函数学习助手

一个帮助用户学习Excel函数的交互式Web应用，使用React + TypeScript构建。

## How to Run

```bash
# 进入前端目录
cd frontend-user

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或使用Docker运行
docker-compose up --build -d
```

访问地址：http://localhost:8081

## Services

| 服务 | 端口 | 说明 |
|------|------|------|
| frontend-user | 8081 | Excel函数学习助手前端 |

## 测试账号

本项目为纯前端应用，无需登录。

## 题目内容

用React + TypeScript + 现代Web技术实现excel函数学习助手，正常演示，操作，小白也能轻松学会

## 项目介绍

### 功能特性

1. **函数分类浏览** - 按类别（文本、数学、日期、逻辑、查找）浏览Excel函数
2. **函数搜索** - 快速搜索需要的函数
3. **交互式演示** - 在模拟表格中实时演示函数效果
4. **参数说明** - 详细的函数参数解释和示例
5. **练习模式** - 提供练习题巩固学习
6. **收藏功能** - 收藏常用函数便于复习

### 技术栈

- React 18
- TypeScript
- Vite
- TailwindCSS
- Zustand (状态管理)
- React Router
