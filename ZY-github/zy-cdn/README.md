# 传讯 (ZY) - GitHub Pages 精简版

基于原网站 https://zunitear.github.io/ZY/ 的精简版本，适用于 GitHub Pages 部署。

## 特点

- 字体、Font Awesome、localforage、jszip 均使用 CDN 引用，无需本地文件
- 图片路径保持 CDN URL 不变
- CSS 和 JS 文件为本地引用

## 已修复的 Bug

1. **后台保活 (features.js)** - 使用内联 WAV data URI 替代外部音频文件，添加 Web Audio API 备用方案
2. **宠物头像 (pet-game.js)** - 修复 PET_TYPES 六种宠物头像全部指向同一图片的问题，改为使用各自第一个品种的头像
3. **家具显示 (pet-game.js)** - 修复 showHouse 只显示基础家具不显示已购买家具的问题，interactFurniture 同时支持已购买家具
4. **朋友圈存储超限 (moments.js)** - 添加多级降级保存策略：纯文本保存 → 最近20条 → 用户提示
5. **备份降级策略 (core.js)** - 将直接砍到 200 条改为逐步降级：500 → 200 → 50
6. **定时保存间隔 (app.js)** - 将 3 分钟定时保存改为 1 分钟，pagehide/beforeunload 时同时调用 saveData()

## 部署

将 ZIP 包解压后上传到 GitHub Pages 仓库根目录即可。
