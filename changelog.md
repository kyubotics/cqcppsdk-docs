---
sidebar: auto
---

# 更新日志

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
