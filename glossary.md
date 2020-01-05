---
sidebar: auto
---

# 术语表

## 酷Q

[酷Q](https://cqp.cc) 是一个易语言编写的 QQ 机器人平台，其本身没有具体的机器人功能，而是负责实现 QQ 协议，并以 DLL 导出函数的形式向插件提供 API 和事件上报。

## CMake

[CMake](https://cmake.org/) 是一个开源的跨平台自动化构建工具。它通过 `CMakeLists.txt` 文件来配置软件的编译、链接、测试等动作，一个简单的例子如下：

```cmake
cmake_minimum_required(VERSION 3.10)

# 设置项目名
project(hello)

# 添加可执行文件
add_executable(hello maim.cpp)
```

具体的使用方法请参考 [CMake Tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/)、[An Introduction to Modern CMake](https://cliutils.gitlab.io/modern-cmake/)、[CMake 入门实战](https://www.hahack.com/codes/cmake/)。

## 现代 C++

现代 C++ 是指 C++11 标准及更新的 C++ 版本，相比旧式 C++，现代 C++ 新增了许多更高级、更高效、更现代的语言特性，如 lambda 表达式、智能指针、auto 类型推断、constexpr、移动语义、标准库算法等。

更多关于现代 C++ 的介绍见 [欢迎回到 C++（现代 C++）](https://docs.microsoft.com/zh-cn/cpp/cpp/welcome-back-to-cpp-modern)。

## Dev 模式

Dev 模式即开发模式，不依赖 Windows 和 MSVC，可在各种平台构建可执行文件，用于进行基本的功能测试。

在 `CMakeLists.txt` 中通过如下代码即可添加 Dev 模式的构建目标：

```cmake
set(CQCPPSDK_DEV_MODE ON)
cq_add_app(app_dev src/demo.cpp)
```

## Std 模式

Std 模式即标准模式，必须在 Windows 环境下使用 MSVC x86 工具集构建，是可以在 酷Q 中运行的真正的 酷Q 应用。

在 `CMakeLists.txt` 中通过如下代码即可添加 Std 模式的构建目标：

```cmake
set(CQCPPSDK_DEV_MODE OFF)
cq_add_app(app src/demo.cpp)
```

<!-- ## CQ 码

是 酷Q 用来表示非文本消息的一种表示方法，形如 `[CQ:image,file=ABC.jpg]`。具体的格式规则，请参考 酷Q 文档的 [CQ 码](https://d.cqp.me/Pro/CQ%E7%A0%81) 和 CoolQ HTTP API 插件文档的 [CQ 码](https://cqhttp.cc/docs/#/CQCode)。

## 消息段

是 CoolQ HTTP API 定义的、和 CQ 码可以互相转换的一个消息表示格式，具体表示方式见 [消息格式](https://cqhttp.cc/docs/#/Message)。

除了纯文本消息段之外，每一个消息段都和一个 CQ 码对应，例如下面这个消息段：

```json
{
    "type": "face",
    "data": {
        "id": "14"
    }
}
```

对应的 CQ 码表示形式就是：

```
[CQ:face,id=14]
```

具体的，NoneBot 中使用 `MessageSegment` 类来表示消息段（继承自 aiocqhttp），例如，要创建上面这个消息段，可以使用如下代码：

```python
seg = MessageSegment(type="face", data={"id": "14"})
```

或：

```python
seg = MessageSegment.face(14)
```
-->
