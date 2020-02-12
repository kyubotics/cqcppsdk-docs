# 一些例子

[开始使用](/dolores/getting-started.md) 中给出了一个极简的「问好」功能实现，本节将通过一些例子来解释 Dolores 的使用逻辑。

## Echo

```cpp
dolores_on_message(echo, command("echo")) {
    session.send(session.command_argument());
}
```

<panel-view title="聊天记录">
<chat-message nickname="Alice" color="#1565c0">/echo 你好，世界！</chat-message>
<chat-message nickname="Bot" avatar="/bot-avatar.png">你好，世界！</chat-message>
</panel-view>

本例中，`dolores_on_message` 的第一个参数 `echo` 是消息事件处理程序的名字（需全局唯一），第二个参数 `command("echo")` 是进入**条件**，意思是：如果一个消息是一条 `echo` 命令调用，那就运行该处理程序。

`session` 是 `dolores_on_message` 隐式给出的一个参数，表示**会话**，封装了事件对象，对于不同的事件类型（消息、通知、请求）提供不同的便捷函数。这里使用了 `session.send`，用于向触发该事件的主体发送消息。

`session.command_argument()` 可以获得 `command` 条件处理后的命令参数（去掉命令名的剩余消息内容）。

## 一言

```cpp
dolores_on_message(yiyan, command("yiyan") | command("yy") | contains("一言")) {
    const auto text = http_get_string("https://v1.hitokoto.cn/?encode=text");
    session.reply(text);
    session.event.block();
}
```

<panel-view title="聊天记录">
<chat-message nickname="Alice" color="#1565c0">一言</chat-message>
<chat-message nickname="Bot" avatar="/bot-avatar.png">@Alice 人生的真理，只是藏在平淡无味之中。</chat-message>
<chat-message nickname="Charlie" color="#00695c">/yy</chat-message>
<chat-message nickname="Bot" avatar="/bot-avatar.png">@Charlie 一个人可以被毁灭，但不能被打败。</chat-message>
</panel-view>

本例展示了进入条件可以通过 `&`（与）和 `|`（或）运算符进行叠加，用户使用 `yiyan`、`yy` 命令或消息中包含 `一言`，都可以触发该处理程序。

除此之外，这里使用了 `session.reply` 函数来回复消息，该函数与 `session.send` 的区别在于：发群或讨论组消息时，会在消息开头@消息发送者。

`session.event.block()` 阻止了事件继续传递到下一个 酷Q 应用。

## 禁言不文明群友

```cpp
dolores_on_message(ban_dirty_words, group(), unblocked(),
                   contains("脏话1") | contains("脏话2") | contains("脏话3")) {
    const auto &event = session.event_as<cq::GroupMessageEvent>();
    cq::set_group_ban(event.group_id, event.user_id, 30 * 60);
    event.block();
}
```

本例展示了进入条件可以有多个，通过逗号隔开，其效果相当于使用 `&` 运算，因此例中的条件相当于：

```cpp
group() & unblocked() & (contains("脏话1") | contains("脏话2") | contains("脏话3"))
```

`group` 条件要求消息必须是群消息；`unblocked` 条件要求事件没有被阻止传递（如果在判断此条件之前，已经有处理程序运行过，且调用了 `event.block()`，则 `unblocked` 条件不满足）。

由于 `dolores_on_message` 隐藏了事件的具体类型，`session.event` 也不再是 `cq::GroupMessageEvent` 类的引用，而是 `cq::MessageEvent` 引用，这种情况下可通过 `session.event_as` 来进行类型转换，并且，由于已经通过 `group` 条件限制了只处理群消息，这个类型转换是安全的。

在事件处理程序中，你仍然可以随意调用 `cq` 命名空间的 API，例如这里的 `cq::set_group_ban`。

## 欢迎新群友

```cpp
dolores_on_notice(welcome_new_member, group::exclude({100100, 100101}),
                  type<cq::GroupMemberIncreaseEvent>) {
    session.reply("欢迎新群友👏");
}
```

本例中，使用 `group::exclude` 条件排除了群号为 `100100` 和 `100101` 的两个群。

`type` 条件比较特殊，它通过模板参数传入事件类来限定要处理的具体事件类型，而不是通过构造函数或静态成员函数，这里 `type<cq::GroupMemberIncreaseEvent>` 要求该通知必须是群成员增加事件。

## 同意入群邀请

```cpp
constexpr int64_t SUPERUSER_ID = 10001000;

dolores_on_request(approve_invitation, user({SUPERUSER_ID}), type<cq::GroupRequestEvent>) {
    session.approve();
}
```

本例中，使用 `user` 条件，限制了触发此处理函数的用户 ID，`user({SUPERUSER_ID})` 要求只有 QQ 号为 `SUPERUSER_ID` 的用户邀请，才会处理。

`session.approve` 封装了任意请求事件的同意操作。
