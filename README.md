# SwanLab-Dashboard

SwanLab - 训练可视化服务

该仓库用于维护SwanLab训练可视化服务的相关代码和文档，包含前后端。

## 目录结构

其中 `swanboard` 用于维护后端代码，`vue` 用于维护前端代码，`test` 用于维护测试代码。

```
├── swanboard
│   ├── controller
│   ├── db
│   ├── middleware
│   ├── module
│   ├── router
│   ├── run
│   ├── settings.py
│   ├── template
│   └── utils
├── test
├── tutils
└── vue
```

## 工作流程

- 后端开发者在 `swanboard` 目录下进行开发，完成后端功能。
- 前端开发者在 `vue` 目录下进行开发，完成前端功能后，需要进行打包 `npm run build.release`，打包目标路径为 `swanboard/template`。
- 前后端开发完成后，需要进行测试，测试代码存放在 `test` 目录下。
- 整体功能通过，即可在 main 上发布新版本，同时发布新 tag，触发自动打包并更新 pypi 包版本。

## SwanLab 与 SwanBoard

SwanBoard 仅负责针对训练数据提供可视化服务，而不参与训练过程。其作为依赖导入到 SwanLab 中，由 `swanlab watch` 命令启动服务。
