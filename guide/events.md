# 事件处理

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

### 类型

前面说到的消息、通知、请求三大类分别对应 SDK 中的三个基类：`MessageEvent`、`NoticeEvent`、`RequestEvent`。每个具体的事件类都继承自这三个基类中的某个，例如 `PrivateMessageEvent` 继承自 `MessageEvent`。

更多具体事件类，请在 酷Q 应用管理窗口的事件列表中查看事件名称，再对照 `core/event.h` 头文件中类定义前的注释即可了解。例如，群禁言事件对应事件类 `GroupBanEvent`。

### 成员变量

事件对象的成员变量可通过编辑器的自动补全来查看（VS Code 中会显示各成员变量的含义和类型），也可以直接前往 `core/event.h` 头文件查看。

这里以 `PrivateMessageEvent` 为例介绍其成员变量，其它类可以按同样的逻辑参考头文件了解。

#### 继承自 `Event` 类的成员

| 成员变量 | 类型 | 说明 |
| --- | --- | --- |
| `time` | `time_t` | 酷Q触发事件的时间 |
| `type` | `std::string` | 事件类型 |
| `detail_type` | `std::string` | 事件详细类型 |
| `sub_type` | `std::string` | 事件子类型 |

其中，三个 `type` 分别表示不同层级的类型划分，所有事件的 `type` 有 `message`、`notice`、`request` 三种，消息事件的 `detail_type` 有 `private`、`group`、`discuss` 三种，私聊消息事件的 `sub_type` 有 `friend`、`group`、`discuss`、`other` 四种。

容易看出，具体事件类是以 `type`+`detail_type` 为粒度区分的，而一个具体的事件可以可能不同的 `sub_type`。

这些 `type` 的可能取值，可以通过具体事件类的 `Type`、`DetailType`、`SubType` 内部类的静态成员变量获得，例如 `e.sub_type == PrivateMessageEvent::SubType::FRIEND` 判定为真表示该私聊消息的子类型是好友私聊。

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
