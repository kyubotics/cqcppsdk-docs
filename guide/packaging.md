# 打包和发布

要发布应用，首先需要为应用确定一个 app id。如果你在使用项目模板，则需要修改 `app_id.txt` 文件中的默认 app id，具体格式参考 [appid 规范](https://docs.cqp.im/dev/v9/appid/)。同时需要修改 `dev` 目录中的开发模式应用目录名。

然后**使用 Release、MinSizeRel 或 RelWithDebInfo 配置重新构建 `app.dll`**（注意不要使用默认的 Debug 配置），再重启 酷Q 或重载应用后，在 酷Q 应用目录窗口中，选择应用后，点击「开发」-「打包」即可将 `app.dll` 和 `app.json` 打包成 CPK 文件。具体可参考 [打包应用](https://docs.cqp.im/dev/v9/getting-started/#%E6%89%93%E5%8C%85%E5%BA%94%E7%94%A8)。

若要将打包后的应用发布到 酷Q 社区，在「Api版本」处应选择「V9」。

## 运行环境要求

基于本 SDK 开发且使用 MSVC 构建的 酷Q 应用（`app.dll`）必须运行在 Windows 7 或更新版本的 Windows 操作系统（32 位或 64 位）和 Wine 上，不支持 Windows XP、Windows Vista 等老旧系统。建议在 Windows 10、Windows Server 2016 或更新版本上使用。

此外，在使用之前必须安装 **Microsoft Visual C++ 可再发行软件包**，可以在 [这里](https://support.microsoft.com/zh-cn/help/2977003/the-latest-supported-visual-c-downloads) 下载，**注意，请选择适用于 Visual Studio 2015、2017 和 2019 的 x86 版本**。

对于较老版本的 Windows，如 Windows 7、Windows Server 2012 等，可能还需安装**通用 C 运行时更新**，~~可以在 [这里](https://support.microsoft.com/zh-cn/help/3118401/update-for-universal-c-runtime-in-windows) 根据系统版本下载~~，由于微软官方文档中的链接失效，目前只能通过打满系统更新来安装。

使用 MinGW 构建的情况尚未充分测试，欢迎补充。
