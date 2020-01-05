# 打包和发布

要发布应用，首先需要为应用确定一个 app id。如果你在使用项目模板，则需要修改 `app_id.txt` 文件中的默认 app id，具体格式参考 [appid 规范](https://docs.cqp.im/dev/v9/appid/)。同时需要修改 `dev` 目录中的开发模式应用目录名。

重启 酷Q 或重载应用后，在 酷Q 应用目录窗口中，选择应用后，点击「开发」-「打包」即可将 `app.dll` 和 `app.json` 打包成 CPK 文件。具体可参考 [打包应用](https://docs.cqp.im/dev/v9/getting-started/#%E6%89%93%E5%8C%85%E5%BA%94%E7%94%A8)。

若要将打包后的应用发布到 酷Q 社区，在「Api版本」处应选择「V9」。
