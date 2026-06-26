# Mengli AI Platform V2

萌力互动 AI 创作平台 - 企业级重构版本

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **路由**：Vue Router
- **状态管理**：Pinia
- **HTTP 客户端**：Axios
- **代码规范**：ESLint + Prettier

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

### 代码格式化
```bash
npm run format
```

## 项目结构

```
src/
├── core/                   # 核心层（全局共享）
├── design-system/          # 设计系统
├── layouts/                # 布局组件
├── modules/                # 业务模块
├── router/                 # 路由
└── docs/                   # 项目文档
```

## 架构规则

详见 [docs/architecture-rules.md](docs/architecture-rules.md)

## 环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

## 开发规范

- TypeScript 严格模式
- 禁止使用 `any`
- 单文件不超过 500 行
- 遵循分层架构原则
- 模块间通过 API / Event Bus 通信

## 许可证

私有项目
