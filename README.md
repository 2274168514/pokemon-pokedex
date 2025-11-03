# 宝可梦图鉴 | Pokémon Pokédex

一个基于 Next.js 和 PokeAPI 构建的现代化宝可梦图鉴应用。

## 特性

- 响应式设计，支持各种设备
- 实时搜索宝可梦
- 按属性筛选功能
- 详细的能力值展示
- 支持中文名称和描述
- 快速加载和流畅动画
- 简洁的白色主题UI设计

## 技术栈

- **前端框架**: Next.js 15
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据源**: PokeAPI
- **API客户端**: pokedex-promise-v2

## 安装和运行

1. 克隆项目
```bash
git clone <repository-url>
cd pokemon-pokedex
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 功能介绍

### 主要功能
- **宝可梦列表**: 展示第一世代（前151个）宝可梦
- **搜索功能**: 支持按名称和ID搜索
- **属性筛选**: 可按单个或多个属性筛选
- **详情页面**: 显示宝可梦的详细信息，包括：
  - 基础信息（身高、体重、分类、栖息地）
  - 属性和特性
  - 六维能力值
  - 中文描述

### 组件结构
```
src/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面
│   └── globals.css         # 全局样式
├── components/
│   ├── PokemonCard.tsx     # 宝可梦卡片
│   ├── PokemonDetail.tsx   # 宝可梦详情弹窗
│   ├── SearchBar.tsx       # 搜索栏
│   └── TypeFilter.tsx      # 属性筛选器
├── lib/
│   └── pokemon-api.ts      # API封装
└── types/
    └── pokemon.ts          # 类型定义
```

## 设计特色

- **简洁UI**: 使用白色主题，清爽简洁的设计风格
- **响应式**: 适配手机、平板和桌面设备
- **流畅动画**: 平滑的过渡效果和微交互
- **属性色彩**: 保留宝可梦属性的配色方案
- **直观交互**: 简单易用的搜索和筛选功能

## 数据来源

本应用使用 [PokeAPI](https://pokeapi.co/) 作为数据源，这是一个免费、开源的宝可梦数据API。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License

## 致谢

- [PokeAPI](https://pokeapi.co/) - 提供宝可梦数据
- [pokedex-promise-v2](https://github.com/PokeAPI/pokedex-promise-v2) - API封装库
- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架

---

如果这个项目对你有帮助，请给个 Star！