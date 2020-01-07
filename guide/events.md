# 事件处理

:::tip 提示
从本页开始，对所有函数、类等，都将假定已经 `using namespace cq;`。
:::

酷Q 通过调用应用 DLL 的导出函数来触发事件处理，事件包括消息、群通知、加好友和加群请求等。

本 SDK 将 酷Q 事件总结为三大类：消息、通知、请求。消息事件包括私聊消息、群消息、讨论组消息等，通知事件包括群成员增减、群管理员变动、好友添加等，请求事件包括好友请求、群请求等。

与事件处理相关的类、函数，在 SDK 的 `core/event.h` 头文件中。

## 注册事件处理函数

可通过 `on_private_message`、`on_group_upload` 等函数将一个函数注册为特定事件的处理函数，例如：

```cpp
on_private_message([](const PrivateMessageEvent &e) {
    // 事件处理逻辑
});
```

`on_*` 函数可以多次调用，因此可以将多个函数注册为同一个事件的处理函数。

事件处理函数应接受唯一一个参数，类型是对应事件类的常量引用。可以使用 `auto` 关键字让编译器进行自动类型推断来使代码更简洁（但可能导致编辑器无法自动补全成员变量）：

```cpp
on_private_message([](const auto &e) {
    // 事件处理逻辑
});
```

更多 `on_*` 函数，可以在 酷Q 应用管理窗口的事件列表中查看事件名称，然后去 `core/events.inc` 文件中找到对应的 `DEF_EVENT` 宏调用，使用 `on_` 前缀加上该宏调用的第一个参数即可。例如，群禁言事件对应的 `DEF_EVENT` 宏调用为 `DEF_EVENT(group_ban, const GroupBanEvent &)`，则该事件对应的注册函数即为 `on_group_ban`，注册事件处理函数的代码为：

```cpp
on_group_ban([](const GroupBanEvent &e) {
    // 事件处理逻辑
});
```

## 事件类

### 表示事件的 C++ 类

前面说到的消息、通知、请求三大类分别对应 SDK 中的三个基类：`MessageEvent`、`NoticeEvent`、`RequestEvent`。每个具体的事件类都继承自这三个基类中的某个，例如 `PrivateMessageEvent` 继承自 `MessageEvent`。

更多具体事件类，请在 酷Q 应用管理窗口的事件列表中查看事件名称，再对照 `core/event.h` 头文件中类定义前的注释即可了解。例如，群禁言事件对应事件类 `GroupBanEvent`。

### 事件类型

每个具体事件类都包含三个表示其不同层级的类型的成员变量：

| 成员变量 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `XxxEvent::Type` | 事件类型 |
| `detail_type` | `XxxEvent::DetailType` | 事件详细类型 |
| `sub_type` | `XxxEvent::SubType` | 事件子类型 |

其中，`XxxEvent` 表示具体事件类，如 `PrivateMessageEvent`。`XxxEvent::Type` 等是枚举类型。

具体事件类是以「**类型+详细类型**」为粒度区分的，而一个具体的事件可能有不同的「**子类型**」。以私聊消息事件为例，所有私聊消息事件的「**类型**」都是 `PrivateMessageEvent::Type::MESSAGE`，「**详细类型**」都是 `PrivateMessageEvent::DetailType::PRIVATE`，但从好友列表发起的私聊的「**子类型**」是 `PrivateMessageEvent::SubType::FRIEND`，而从群临时会话发起的私聊的「**子类型**」是 `PrivateMessageEvent::SubType::GROUP`。若要在代码中进行判断，可以这么写：

```cpp
if (e.sub_type == PrivateMessageEvent::SubType::GROUP) {
    send_message(e.target, "暂时不支持群临时会话哦");
}
```

### 成员变量

事件对象的成员变量可通过编辑器的自动补全来查看（VS Code 中会显示各成员变量的含义和类型），也可以直接前往 `core/event.h` 头文件查看。

这里以 `PrivateMessageEvent` 为例介绍其成员变量（这里将跳过上面已经介绍过的 `type`、`detail_type`、`sub_type`），其它类可以按同样的逻辑参考头文件了解。

#### 继承自 `Event` 类的成员

| 成员变量 | 类型 | 说明 |
| --- | --- | --- |
| `time` | `time_t` | 酷Q触发事件的时间 |

#### 继承自 `UserEvent` 类的成员

| 成员变量 | 类型 | 说明 |
| --- | --- | --- |
| `target` | `Target` | 触发事件的主体 |

触发事件的主体是指某用户、或某群的某用户等，可用于发送回复时指定目标。例如，`send_message(e.target, "你好")` API 调用可向触发事件的主体发送「你好」。

#### 继承自 `MessageEvent` 类的成员

| 成员变量 | 类型 | 说明 |
| --- | --- | --- |
| `message_id` | `int32_t` | 消息 Id |
| `message` | `std::string` | 消息内容 |
| `font` | `int32_t` | 字体, 此属性已经没有实际意义 |

对于群消息而言，消息 Id 可用于撤回消息。

#### 继承自 mixin 类的成员

| 成员变量 | 类型 | 说明 |
| --- | --- | --- |
| `user_id` | `int64_t` | 用户 Id（QQ 号） |
