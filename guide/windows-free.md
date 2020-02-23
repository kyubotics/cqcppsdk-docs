# 免 Windows 开发

本 SDK 设计之初就希望能够在非 Windows 系统上完成整个开发、测试、部署流程。

## Dev 模式

正如 [开始使用](/guide/getting-started.md) 中介绍的，在任何平台都可以构建和运行 dev 模式的可执行文件 `app_dev`，运行该程序将启动一个模拟的「私聊窗口」，输入内容后回车将会触发一个私聊事件，从而调用私聊事件处理函数。

这里举个例子：

```cpp
#include <cqcppsdk/cqcppsdk.h>

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

## 单元测试

在项目根目录的 `CMakeLists.txt` 中加入：

```cmake
enable_testing()
add_subdirectory(tests)
```

即可添加 `tests` 子目录中的测试项目，具体请参考 [`cqcppsdk/tests`](https://github.com/cqmoe/cqcppsdk/tree/master/tests)。

单元测试可以在任何平台进行，当需要使用 酷Q API 时，可以选择性地进行模拟实现，例如：

```cpp
#include <cqcppsdk/cqcppsdk.h>

namespace cq {
    GroupMember get_group_member_info(const int64_t group_id, const int64_t user_id, const bool no_cache) {
        GroupMember mem;
        switch (user_id) {
        case MEMBER_USER_ID:
            mem.role = GroupRole::MEMBER;
            break;
        case ADMIN_USER_ID:
            mem.role = GroupRole::ADMIN;
            break;
        case OWNER_USER_ID:
            mem.role = GroupRole::OWNER;
            break;
        default:
            break;
        }
        return mem;
    }
} // namespace cq

TEST_CASE("cq::get_group_member_info", "[cq api]") {
    auto gm = cq::get_group_member_info(100100, MEMBER_USER_ID);
    REQUIRE(gm.role == cq::GroupRole::MEMBER);
}
```

## MinGW 交叉编译

可以使用 MinGW w64 i686 工具链在 macOS、Linux 等平台交叉编译可在 酷Q 中运行的 `app.dll`，注意需添加 `-DCMAKE_SYSTEM_NAME=Windows` CMake 选项。

## AppVeyor 持续集成

[AppVeyor](https://www.appveyor.com/) 免费提供了 Windows 环境的持续集成服务，可使用其中的 MSVC 工具链自动化构建 `app.dll`。

SDK 项目模板中提供了一个 [`appveyor.yml`](https://github.com/cqmoe/cqcppsdk-template/blob/master/appveyor.yml) 文件用于配置 AppVeyor CI，如果你是在模板基础上进行开发的，则几乎不需要修改即可直接使用。

在 AppVeyor CI 的「Projects」页面添加工程后，点击「NEW BUILD」即可触发自动化构建，此后每次 Git push 都会触发新的构建。构建成功后，`app.dll` 和 `app.json` 一起打包在了 `<你的AppId>.zip` 中，可在构建任务的「Artifacts」页下载。

## 使用 Docker 运行

在 Docker 容器内运行 酷Q 的方法请参考 [酷Q on Docker](https://cqp.cc/t/34558)。将前面的步骤构建出的 `app.dll` 和 `app.json` 复制到容器内的 酷Q 目录（通常通过 `-v` 参数挂载），即可像 Windows 上那样运行和打包应用。
