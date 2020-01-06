# 免 Windows 开发

本 SDK 设计之初就希望能够在非 Windows 系统上完成整个开发、测试、部署流程。

## 使用 dev 模式测试功能

正如 [开始使用](/guide/getting-started.html) 中介绍的，在任何平台都可以构建 dev 模式的可执行文件 `app_dev`，运行该程序将启动一个模拟的「私聊窗口」，输入内容后回车将会触发一个私聊事件，从而调用私聊事件处理函数。

这里举个例子：

```cpp
#include "cqcppsdk.h"

using namespace cq;

CQ_INIT {
    on_enable([] { logging::debug("启用", "应用已启用！"); });

    on_private_message([](const auto &e) {
        send_message(e.target, "你的消息我收到啦！");
    });
}
```

构建出可执行文件后运行，测试如下：

```
add_log
  level: 0
  tag: 启用
  message: 应用已启用！

>>> 你好
send_private_message
  user_id: 2
  message: 你的消息我收到啦！
```

## 使用 AppVeyor CI 自动化构建

要构建可在 酷Q 中运行的 `app.dll`，需要使用 MSVC x86，而这必须在 Windows 环境下安装。好在 [AppVeyor](https://www.appveyor.com/) 免费提供了 Windows 环境的持续集成服务，可用于构建我们需要的动态链接库。

SDK 项目模板中提供了一个 [`appveyor.yml`](https://github.com/cqmoe/cqcppsdk-template/blob/master/appveyor.yml) 文件用于配置 AppVeyor CI，如果你是在模板基础上进行开发的，则几乎不需要修改即可直接使用。

在 AppVeyor CI 的「Projects」页面添加工程后，点击「NEW BUILD」即可触发自动化构建，此后每次 Git push 都会触发新的构建。构建成功后，`app.dll` 和 `app.json` 一起打包在了 `<你的AppId>.zip` 中，可在构建任务的「Artifacts」页下载。

## 在 Docker 容器内运行

在 Docker 容器内运行 酷Q 的方法请参考 [酷Q on Docker](https://cqp.cc/t/34558)。将 AppVeyor CI 构建出的 `app.dll` 和 `app.json` 复制到容器内的 酷Q 目录（通常通过 `-v` 参数挂载），即可像 Windows 上那样运行和打包应用。
