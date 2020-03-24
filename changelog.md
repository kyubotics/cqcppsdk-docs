---
sidebar: auto
---

# 更新日志

## v0.4.2

- 修复大小写敏感文件系统上 MinGW 包含 `Windows.h` 时出错的问题
- 修复 Windows 上使用 MinGW 构建时的编码问题

## v0.4.1

- 新增 `cq::utils::ansi` 函数，用于将 UTF-8 字符串转为 ANSI 编码（以调用 Windows API 或进行文件操作等）

## v0.4.0

- 更名 `cqcppsdk/cqcppsdk.h` 为 `cqcppsdk/cqcppsdk.hpp`，旧的 `.h` 文件目前仍保留，但建议尽快更新
- 移除 `cqcppsdk/utils/string.h`，现在字符串工具模块直接包含在 `cqcppsdk/cqcppsdk.hpp` 中
- 优化 CMake 配置
- 调整 Dolores 接口，将「Session」概念窄化为「Matcher 数据」

## v0.3.0

- 新增 `cq::to_string` 函数，在 `cqcppsdk/utils/string.h`，不再提供扩展的 `std::to_string` 重载
- 支持使用 MinGW（mingw32）构建 std 模式的 `app.dll`
- 新增 `cq_add_std_app`、`cq_add_dev_app` CMake 函数，分别用于添加 std 模式和 dev 模式构建目标，不再建议直接使用 `cq_add_app`
- 新增 `cq_install_std_app` CMake 函数，使用 CMake 原生的 install 功能安装 `app.dll` 和 `app.json` 到 酷Q 目录
- 大幅调整了 Dolores 接口，在名词含义上，原来的「会话」（Session）改为「Current」，「状态」（State）改为「Session」，「条件」（Condition）改为「Matcher」，其它变更请参考最新文档

由于本次更新包含 CMake 脚本的变更，可能需要适当修改你的项目 `CMakeLists.txt`，新的用法如下（旧的用法仍然可以工作，但建议尽快更新）：

```cmake
if (CQ_CAN_BUILD_STD_MODE)
    cq_add_std_app(main.cpp utils.cpp) # 添加 std 模式的动态链接库构建目标
    cq_install_std_app("C:/Path/To/酷Q Air")
endif ()

# 添加 dev 模式的可执行文件构建目标
cq_add_dev_app(main.cpp utils.cpp)
```

具体请参考项目模板的 [`CMakeLists.txt`](https://github.com/cqmoe/cqcppsdk-template/blob/master/CMakeLists.txt)。

## v0.2.1

- 优化 酷Q API 函数加载效率
- 修复 Dolores 接口若干 bug

## v0.2.0

### 💡 新增特性

- `Target` 类新增 `is_private`、`is_group`、`is_discuss` 方法，分别用于判断主体是来自私聊（私人通知等）、群聊（群通知等）还是讨论组
  ```cpp
  if (e.target.is_group()) {
      // 当前事件是群消息、群通知或群请求
      const auto group_id = e.target.group_id.value();
  }
  ```
- `dir` 模块的 `root`、`app`、`app_per_account` 函数现支持任意数量的参数，用于拼接路径，其中 `root` 不会自动创建不存在的目录，而后两者会自动创建
  ```cpp
  dir::root("data", "image"); // -> "C:\\path\\to\\coolq\\data\\image\\"
  ```
- 新增了一套新的事件处理接口，见 [Dolores](/dolores/)

### 🔨 行为变更

- `cqcppsdk/cqcppsdk.h` 现包含 `cqcppsdk/utils/string.h`，可直接使用 `utils::s2ws` 等函数
- `logging` 模块现确保不抛出异常，如果日志失败，将忽略（`add_log` 仍会抛出异常）
- 事件处理函数抛出的所有继承自 `std::exception` 的异常现在会被捕获，并打印日志，不用再担心调用 API 时忘记 try catch 导致程序崩溃（事件处理函数活跃期之外调用 API 仍然应当妥善处理异常）
- `user_id` 属性现已从具体类移动到 `UserEvent`（不影响现有代码）

### 🐛 Bug 修复和细节优化

- 修复 dev 模式中，打印 API 调用信息时参数名错误的 bug
- 修复 GCC 8.x 兼容性问题
- 修复潜在的未定义行为

## v0.1.3

- 修复没有使用 `CQ_INIT` 宏的情况下，编译出的程序无法启动的 bug
- 修复 CMake 函数 `cq_add_app` 不能处理列表参数的 bug，此 bug 会导致 `cq_add_app(app ${SOURCE_FILES})` 只会传入 `${SOURCE_FILES}` 中的第一项，如果此前你使用字符串传递了参数，如 `cq_add_app(app "a.cpp b.cpp")`，应当改为 `cq_add_app(app a.cpp b.cpp)`，类似内置的 `add_executable`

## v0.1.2

- 引入字符串相关工具函数 `utils::s2ws` 和 `utils::ws2s` 等，需 `#include <cqcppsdk/utils/string.h>`

## v0.1.1

- 修改 `send_message` 接口，现不再默认@用户，仍可通过第三个参数 `at_user`（传入 `true`）使它@

## v0.1.0

- 调整头文件位置，现在需要通过 `#include <cqcppsdk/cqcppsdk.h>` 引入
- 新增请求事件标识的包装类 `RequestEvent::Flag`，`RequestEvent` 的 `flag` 成员变量改为该类型，同时 `set_friend_request` 和 `set_group_request` 接口的第一个参数改为 `const RequestEvent::Flag &flag`，减少传参出错的可能
- 修改 `set_group_anonymous_ban` 接口的第二个参数，从 `const std::string &anonymous_flag` 改为 `const Anonymous &anonymous`，更好地隐藏实现细节
- 修改各事件类的 `Type`、`DetailType`、`SubType`、`Operation` 等为 `enum class` 类型，解决名字重复重复问题，并提高类型安全性
- 减少不必要的拷贝，提高运行效率
- 修复一些小错误

## v0.0.3

- 新增事件回调注册函数 `on_message`、`on_notice`、`on_request`，用于注册事件大类的统一处理函数，使用方式同 `on_private_message` 等
- 新增 `message` 模块，使用方式请见文档「其它实用模块」部分
- 添加 `.editorconfig` 文件，确保使用 VS 时能默认使用 UTF-8 编码
- 统一不同模块中 `message_id` 的类型，现全部为 `int64_t`
- 修复 dev 模式若干兼容性和字符编码问题，现在 Win32 环境下将自动切换控制台代码页到 65001，不再需要手动修改

## v0.0.2

- 修复 GCC 8.x 的 `filesystem` 库链接错误问题（仍然不保证能够在任何 GCC 8.x 版本构建，推荐使用 GCC 9+）
- 修改 `type`、`detail_type`、`sub_type` 成员变量为枚举类型，提高运行效率，并提供 `std::to_string` 函数重载以将枚举转换为 `std::string`

## v0.0.1

初始版本。
