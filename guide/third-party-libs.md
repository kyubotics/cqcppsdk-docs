# 使用第三方库

有多种方式在本 SDK 中使用第三方库，总结起来有两种，一种是手动修改 `CMakeLists.txt` 使构建应用时同时构建第三方库，然后链接；另一种是通过包管理器预先编译好并安装在特定位置，然后在应用中直接包含头文件并链接。以下对这两种方案分别介绍两个具体方式。

:::tip 提示
本页所说的「`cq_add_app` 调用」，指 `cq_add_app`、`cq_add_std_app` 或 `cq_add_dev_app`，其中后两者是 `cq_add_app` 的封装，分别固定了 target 名为 `app` 和 `app_dev`。
:::

## 直接导入库代码

对于小型库或只有头文件（header only）的库，直接把库代码添加到项目中会比较方便。这里以 JSON 库 [nlohmann/json](https://github.com/nlohmann/json) 为例。

首先前往 [Release](https://github.com/nlohmann/json/releases) 页面下载最新版的 `json.hpp`，放到项目的 `extern/nlohmann-json/include/nlohmann` 中（需手动创建），然后在 `CMakeLists.txt` 中适当位置（`cq_add_app` 调用之前的任何位置）添加：

```cmake
include_directories(extern/nlohmann_json/include) # 添加包含目录
```

然后即可使用：

```cpp
#include <cqcppsdk/cqcppsdk.hpp>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

CQ_INIT {
    cq::on_private_message([](const auto &event) {
        json j;
        j["foo"] = "bar";
        j["baz"] = 42;
        try {
            send_message(event.target, j.dump(4));
        } catch (cq::ApiError &) {
        }
    });
}
```

## Git 子模块

对于原生支持 CMake 的第三方库，可以使用 Git 子模块来集成，并且可以很方便地控制分支或提交版本。这里以 HTTP 请求库 [curl](https://github.com/curl/curl) 为例。

首先在命令行进入项目目录，运行：

```bash
git submodule add https://github.com/curl/curl.git extern/curl
```

这会将 curl 仓库克隆到 `extern/curl` 目录中。然后在 `CMakeLists.txt` 中 `cq_add_app` 调用之前的任何地方添加：

```cmake
option(BUILD_SHARED_LIBS "" OFF) # 设置编译静态库而不是默认的动态库
add_subdirectory(extern/curl) # 添加 CMake 子目录

include_directories(extern/curl/include) # 添加包含目录

add_definitions(-DCURL_STATICLIB) # 设置使用静态库
```

再在 `cq_add_app` 调用之后添加 `target_link_libraries(<TARGET_NAME> libcurl)`，例如：

```cmake
cq_add_std_app(${SOURCE_FILES})
target_link_libraries(app libcurl)
```

注意，如果有多个 `cq_add_app` 调用，则对每个 target 都需要添加 `target_link_libraries`，例如：

```cmake
cq_add_std_app(${SOURCE_FILES})
target_link_libraries(app libcurl)

cq_add_dev_app(${SOURCE_FILES})
target_link_libraries(app_dev libcurl)
```

`CMakeLists.txt` 修改完成后，即可在代码中使用 curl：

```cpp
#include <cqcppsdk/cqcppsdk.hpp>
#include <curl/curl.h>

std::string get_content(const std::string &url) {
    std::string body;

    auto curl = curl_easy_init();
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);

        auto receive = [](char *buf, size_t size, size_t count, void *data) {
            (*static_cast<std::string *>(data)) += std::string(buf, count);
            return size * count;
        };
        typedef size_t (*WriteFunction)(char *, size_t, size_t, void *);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, static_cast<WriteFunction>(receive));
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &body);

        curl_easy_perform(curl);

        curl_easy_cleanup(curl);
    }

    return body;
}

CQ_INIT {
    cq::on_private_message([](const auto &event) {
        try {
            send_message(event.target, get_content("http://www.httpbin.org/get"));
        } catch (cq::ApiError &) {
        }
    });
}
```

## Vcpkg

[Vcpkg](https://github.com/microsoft/vcpkg) 是微软推出的一个 C/C++ 包管理器，使用它安装第三方库之后，直接在 `CMakeLists.txt` 中配置链接即可。这里以 GUI 库 [nana](https://github.com/cnjinhao/nana) 为例。

:::warning 注意
Vcpkg 暂时不支持跨平台编译 Windows 版的依赖库，以下内容只适用于在 Windows 下开发的情况。
:::

首先安装 vcpkg：

```bash
# 克隆仓库
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg

# 初始化
./bootstrap-vcpkg.bat
```

:::tip 提示
理论上 vcpkg 可以安装在任何地方，但因为各项目所依赖的第三方库及其版本可能不同，全局使用一个 vcpkg 实例可能容易造成混乱，建议每个项目对应一个 vcpkg 实例。这里将把 vcpkg 安装在项目目录中，也就是 `awesome-bot/vcpkg`。
:::

`bootstrap-vcpkg` 脚本将会构建出可执行文件 `vcpkg.exe`。此时可运行：

```bash
./vcpkg
```

来检查安装是否成功。

由于 vcpkg 对不同系统、平台和链接方式，需要使用不同的 triplet（vcpkg 中定义安装配置的文件），以下只介绍 Windows 上 x86 编译、静态库链接、动态 CRT 链接的情况。

安装 nana 库：

```bash
./vcpkg install nana:x86-windows-static-md
```

成功后 `vcpkg/installed/x86-windows-static-md/lib` 中应有 `nana.lib` 等静态库文件。然后再修改 `CMakeLists.txt` 中 `cq_add_app` 调用附近的代码形如：

```cmake
find_package(unofficial-nana CONFIG REQUIRED)

cq_add_std_app(${SOURCE_FILES}) # 添加 std 模式的动态链接库构建目标
target_link_libraries(app unofficial::nana::nana)
```

:::tip 提示
尽管 vcpkg 安装完 nana 后，提示使用 `target_link_libraries(main PRIVATE unofficial::nana::nana)`，这里不应该添加 `PRIVATE`，因为 SDK 的 CMake 脚本中使用了不带 `PRIVATE` 的 `target_link_libraries`，这里需保持一致。
:::

之后便可在代码中使用：

```cpp
#include <cqcppsdk/cqcppsdk.hpp>
#include <nana/gui.hpp>

CQ_INIT {
}

CQ_MENU(menu_demo_1) {
    nana::msgbox msg{"标题"};
    msg << "你点击了菜单";
    msg.show();
}
```

最后，使用 CMake 构建时，需要指定 `CMAKE_TOOLCHAIN_FILE` 和 `VCPKG_TARGET_TRIPLET`：

```bash
cmake -B build -DCMAKE_TOOLCHAIN_FILE="./vcpkg/scripts/buildsystems/vcpkg.cmake" -DVCPKG_TARGET_TRIPLET="x86-windows-static-md" -A Win32
cmake --build build --target app
```

:::tip 提示
要在 VS Code 中使用 CMake Tools 配置，可添加工作区设置如下：

```json
{
    "cmake.configureSettings": {
        "CMAKE_TOOLCHAIN_FILE": "${workspaceRoot}/vcpkg/scripts/buildsystems/vcpkg.cmake",
        "VCPKG_TARGET_TRIPLET": "x86-windows-static-md"
    }
}
```

VS 也可以在 `CMakeSettings.json` 中进行类似的配置，请自行搜索。
:::

## Conan

Conan 是一个与 vcpkg 类似的 C/C++ 包管理器，两者使用方式有些区别，但总体思想大同小异。由于 conan 使用起来较为简单，并且这里篇幅有限，请自行参考其 [官方文档](https://docs.conan.io/en/latest/)。
