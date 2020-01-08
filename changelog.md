---
sidebar: auto
---

# 更新日志

## v0.0.2

- 修复 GCC 8.x 的 `filesystem` 库链接错误问题（仍然不保证能够在任何 GCC 8.x 版本构建，推荐使用 GCC 9+）
- 修改 `type`、`detail_type`、`sub_type` 成员变量为枚举类型，提高运行效率，并提供 `std::to_string` 函数重载以将枚举转换为 `std::string`

## v0.0.1

初始版本。
