# 技术设计
1. 计时器实现
- 核心：使用 requestAnimationFrame 或 setInterval 每秒更新 UI。
- 精度：避免使用 setTimeout 累加，应基于 Date.now() 计算剩余时间，防止后台卡顿时误差累积。
- 暂停：清除定时器，记录剩余秒数。

2. 后台运行与通知
- 保持唤醒：番茄钟需要后台持续运行，但浏览器限制严格。可提示用户“保持页面活跃”或使用 Web Worker 计时，但 Worker 不能直接操作 DOM，需通过 postMessage 通信。
- 系统通知：结合之前讨论的 Notification API，在计时结束时弹出通知。
- 权限请求需在用户手势后（例如点击“开始”时顺便请求）。
- 移动端最好配合 Service Worker 发送通知（通过 showNotification 方法），提高可靠性。
- 声音提示：用 new Audio() 播放一段短提示音（注意移动端自动播放策略，需在用户交互后）。

3. 数据持久化
- 设置保存：用户自定义的工作/休息时长、是否自动开始下一个等，存入 localStorage。
- 历史记录：每次完成的番茄记录（时间、任务标签）存入 IndexedDB，用于后续统计。