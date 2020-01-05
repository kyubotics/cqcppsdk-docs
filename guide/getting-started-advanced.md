# 开始使用（高级）

CoolQ C++ SDK 提供了一个基本的 [项目模板](https://github.com/cqmoe/cqcppsdk-template)，如果你需要快速地进行体验或者做一些概念验证，不妨直接使用模板；而如果你已经有适合自己或团队的 C++ 和 CMake 项目框架，也可以进行手动配置，本 SDK 的 CMake 配置基本上是非侵入式的。

## 使用模板

直接克隆模板仓库（或者先「Use this template」再克隆你的账号下新建的仓库，这里以直接克隆为例），并初始化子模块：

```bash
git clone https://github.com/cqmoe/cqcppsdk-template.git awesome-bot
cd awesome-bot
git submodule init # 初始化 Git 子模块
git submodule update # 更新 Git 子模块
```

然后运行：

```bash
mkdir build # Windows 上需使用 md build
cd build
cmake .. # 运行 CMake generate
```

来产生工程文件，接着运行：

```bash
cmake --build . --target app_dev
```

即可构建 dev 模式的可执行文件，运行 `./build/app_dev` 会进入一个交互式命令行，输入内容后会产生一个模拟的私聊消息，触发私聊消息事件处理，可进行基本的功能测试。

:::warning 注意
如果 Windows 上运行 `app_dev` 出现乱码，则需要先运行命令 `chcp 65001` 将控制台代码页切换为 UTF-8。
:::

若要构建能在 酷Q 开发模式运行的 `app.dll`，需在 Windows 环境下使用 Visual Studio 生成工具 x86 来构建：

```powershell
cd build
cmake -G 'Visual Studio 16 2019' -A Win32 ..
cmake --build . --target app
```

将构建出的 `app.dll` 和项目根目录的 `app.json` 拷贝到 酷Q 的 `dev/com.example.demo` 目录中（需手动创建），然后打开 酷Q 的开发模式（见 [开发模式](https://docs.cqp.im/dev/v9/devmode/)），再在应用管理里面启用即可。

:::tip 提示
可以修改项目模板的 `scripts/install.ps1` 中的 `$coolqRoot` 值为你的 酷Q 路径，CMake 在构建 `app.dll` 完成后会自动运行该安装脚本，将 `app.dll` 和 `app.json` 复制到 酷Q 目录中的相应位置。
:::

## 手动配置

这里假设你的项目结构与 SDK 项目模板类似：

:::tree
.
├─extern _(**第三方依赖库**)_
│  └─curl
├─src _(**项目源文件**)_
│  └─app.cpp
└─CMakeLists.txt
:::

首先需要将 CoolQ C++ SDK 导入项目中，可以直接下载 [cqcppsdk](https://github.com/cqmoe/cqcppsdk) 到 `extern` 目录，也可以添加 Git 子模块：

```bash
git submodule add https://github.com/cqmoe/cqcppsdk.git extern/cqcppsdk
```

再在你的 `CMakeLists.txt` 中添加如下内容：

```cmake
set(CMAKE_CXX_STANDARD 17) # 设置 C++ 标准版本为 C++17

include_directories(extern/cqcppsdk/include) # 设置 SDK 的 include 目录为包含目录

include(extern/cqcppsdk/cqcppsdk.cmake) # 包含 SDK 的 CMake 脚本

cq_set_app_id("com.your-company.awesome-bot") # 设置 app id, 见酷Q文档

if(MSVC AND (CMAKE_SIZEOF_VOID_P EQUAL 4)) # MSVC x86
    cq_add_app(app src/app.cpp) # 添加 std 模式的动态链接库构建目标
endif()

# 添加 dev 模式的可执行文件构建目标
set(CQCPPSDK_DEV_MODE ON)
cq_add_app(app_dev src/app.cpp)
```

:::warning 注意
`extern/cqcppsdk/cqcppsdk.cmake` 脚本会在使用 MSVC 时添加编译选项 `/utf-8`，因此所有源码文件都应使用 UTF-8 编码。
:::

然后在 `src/app.cpp` 中使用 SDK 即可：

```cpp
#include "cqcppsdk.h"

CQ_INIT {
    cq::on_private_message([](const cq::PrivateMessageEvent &e) {
        if (e.message == "你好") {
            try {
                cq::send_message(e.target, "你也好～");
            } catch (cq::ApiError &) {
            }
        }
    });
}
```
