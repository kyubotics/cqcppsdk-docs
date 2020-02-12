# 开始使用

Dolores 接口是 CoolQ C++ SDK 的一部分，无需单独安装。

## 初始化

要使用 Dolores，首先需要在 `CQ_INIT` 中进行初始化：

```cpp
// init.cpp

#include <dolores/dolores.hpp>

CQ_INIT {
    dolores::init();
}
```

建议将此初始化代码单独放在一个 C++ 源文件中，例如 `init.cpp`。

## 编写功能

Dolores 提供了三个宏：`dolores_on_message`、`dolores_on_notice`、`dolores_on_request`，分别用于注册消息、通知、请求事件的处理程序。

这里以实现一个「问好」功能为例：

```cpp
// greeting.cpp

#include <dolores/dolores.hpp>

using namespace dolores::cond;

dolores_on_message(hello, contains("你好")) {
    session.send("你也好");
}
```

:::tip 提示
上面的 `contains` 是 `dolores::cond` 命名空间中的类，由于文档中需大量使用此命名空间的类和对象，后面将默认已经 `using namespace dolores::cond`。
:::

按照 [指南](/guide/) 中所介绍的，构建并运行，可以得到如下效果：

<panel-view title="聊天记录">
<chat-message nickname="Alice" color="#1565c0">你好</chat-message>
<chat-message nickname="Bot" avatar="/bot-avatar.png">你也好</chat-message>
</panel-view>
