# 其它实用模块

## `logging` 模块

用于向 酷Q 日志窗口写入日志。例如：

```cpp
logging::debug("标签", "Debug 日志");
logging::info("标签", "Info 日志");
logging::info_success("标签", "Info 成功日志");
logging::info_recv("标签", "Info 接收日志");
logging::info_send("标签", "Info 发送日志");
logging::warning("标签", "Warning 日志"); // 会导致 酷Q 弹出警告气泡
logging::error("标签", "Error 日志"); // 会导致 酷Q 弹出错误气泡
logging::fatal("标签", "Fatal 日志"); // 会导致 酷Q 弹出错误窗口，确定后退出
```

## `dir` 模块

用于获取 酷Q 主目录、应用目录、应用子目录、每个账号独立的应用子目录等（结尾总是包含 `\`）。例如：

```cpp
dir::root() // C:\Users\Username\Apps\酷Q Air\
dir::app() // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\
dir::app("log") // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\log\
dir::app_per_account() // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\12345678\
dir::app_per_account("log") // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\12345678\log\
```

当上面获取的目录不存在时，将会创建。

## `message` 模块

用于处理消息内容。

### `escape` 和 `unescape` 函数

分别用于对文本进行 CQ 码转义和去转义，例如：

```cpp
message::escape("[hello,world]"); // &#91;hello&#44;world&#93;
message::escape("[hello,world]", false); // &#91;hello,world&#93; (不转义逗号)
message::unescape("&#91;hello,world&#93;"); // [hello,world]
```

### `MessageSegment` 类

用于表示 CQ 码和纯文本（以下统称为「消息段」），提供静态成员函数来方便构造各类消息段，例如：

```cpp
using MessageSegment = message::MessageSegment;

MessageSegment::text("这是一段文本，可以直接包含特殊符号如 []"); // 这是一段文本，可以直接包含特殊符号如 &#91;&#93;
MessageSegment::face(111); // [CQ:face,id=111]
MessageSegment::image("ABC.jpg") // [CQ:image,file=ABC.jpg]
MessageSegment::at(12345678) // [CQ:at,qq=12345678]
// ...
```

更多静态成员函数请参考 `core/message.h` 头文件中的类定义和注释。

### `Message` 类

用于表示包含一系列 CQ 码或纯文本的完整消息，本质上是消息段链表。提供 `+` 运算符重载，可以自由拼接消息，也可以利用 `std::list` 的标准接口精细地插入或删除消息段元素。

示例：

```cpp
Message msg1("啦啦啦，来个表情：[CQ:face,id=111]"); // 将字符串解析为 Message 对象
msg1 += MessageSegment::at(12345678); // 拼接一个 at 消息段
msg1.send(e.target); // 向触发 e 事件的主体发送该消息

const auto msg2 = Message(e.message); // 从消息事件的消息内容解析 Message 对象
for (const auto &seg : msg2) { // 遍历消息段
    if (seg == MessageSegment::at(12345678)) { // 发现 at 消息段
        send_message(e.target, "@我干啥？");
        break;
    }
}

const auto msg = Message("这是一个[CQ:face,id=111]图文[CQ:image,file=123.jpg]混杂的消息");
msg.extract_plain_text() // 提取出 "这是一个 图文 混杂的消息"
```

## `utils` 模块

### 字符串相关

使用本 SDK 要求全程使用 UTF-8 编码的字符串，但在进行文件操作、使用 Windows API 等时，常常需要使用 ANSI 编码（Windows 上一种随所保存的文本内容而切换具体编码方式的编码）、宽字符串（`std::wstring`）或 C 风格的宽字符串（`const wchar_t *`）。

现在可以使用 `utils` 模块中的 `s2ws`、`ws2s` 函数来在宽字符串和 UTF-8 编码的字符串之间转换，例如：

```cpp
#include <cqcppsdk/cqcppsdk.h>
#include <cqcppsdk/utils/string.h>
#include <fstream>
#include <iostream>

using cq::utils::s2ws;
using cq::utils::ws2s;

CQ_INIT {
    cq::on_enable([] {
        std::ofstream out(s2ws("日志.txt"));
        out << "应用已启用" << std::endl;
    });
}
```
