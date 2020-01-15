# 使用第三方库

有多种方式在本 SDK 中使用第三方库，总结起来有两种，一种是手动修改 `CMakeLists.txt` 使构建应用时同时构建第三方库，然后链接；另一种是通过包管理器预先编译好并安装在特定位置，然后在应用中直接包含头文件并链接。

## 直接导入库代码

对于小型库或只有头文件（header only）的库，直接把库代码添加到项目中会比较方便。这里以 JSON 库 [nlohmann/json](https://github.com/nlohmann/json) 为例。

首先前往 [Release](https://github.com/nlohmann/json/releases) 页面下载最新版的 `json.hpp`，放到项目的 `extern/nlohmann-json/include/nlohmann` 中（需手动创建），然后在 `CMakeLists.txt` 中适当位置（`cq_add_app` 调用之前的任何位置）添加：

```cmake
include_directories(extern/nlohmann_json/include) # 添加包含目录
```

然后即可使用：

```cpp
#include <cqcppsdk/cqcppsdk.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

CQ_INIT {
    cq::on_private_message([](const auto &e) {
        json j;
        j["foo"] = "bar";
        j["baz"] = 42;
        try {
            send_message(e.target, j.dump(4));
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

再在 `cq_add_app` 调用之后添加：

```cmake
target_link_libraries(${LIB_NAME} libcurl)
```

注意，如果有多个 `cq_add_app` 调用，则对每个 target 都需要添加 `target_link_libraries`，例如：

```cmake
cq_add_app(${LIB_NAME} ${SOURCE_FILES})
target_link_libraries(${LIB_NAME} libcurl)

set(CQCPPSDK_DEV_MODE ON)
cq_add_app(${LIB_NAME}_dev ${SOURCE_FILES})
target_link_libraries(${LIB_NAME}_dev libcurl)
```

`CMakeLists.txt` 修改完成后，即可在代码中使用 curl：

```cpp
#include <cqcppsdk/cqcppsdk.h>
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
    cq::on_private_message([](const auto &e) {
        try {
            send_message(e.target, get_content("http://www.httpbin.org/get"));
        } catch (cq::ApiError &) {
        }
    });
}
```

## CMake ExternalProject

## Vcpkg

## Conan
