# API 调用

酷Q 应用通过调用 酷Q 的 `CQP.dll` 中的导出函数来调用 酷Q 提供的功能，包括发送消息、禁言群成员、处理加群请求等。

本 SDK 对 酷Q 公开提供的所有 DLL 接口进行了面向对象封装，API 声明和其功能描述在 SDK 的 `core/api.h` 头文件中。

:::warning 注意
API 调用的位置是有限制的，初始化事件中和 `CQ_INIT` 中不可以调用 API，所有 API 调用必须发生在应用初始化事件完成后。
:::

## 调用时机

由于 API 需要调用 `CQP.dll` 中的函数，而调用它需要 auth code，即认证码（在初始化事件中传递给应用），因此所有 API 调用必须发生在应用初始化事件处理完成后，也就是说，初始化事件中和 `CQ_INIT` 中都不可以调用 API（`logging` 模块中的函数也需要调用 酷Q API，因此也不可以）。

所有 API 都可以多线程调用，也可以在事件处理函数之外（但不是在 `CQ_INIT` 的最外层）调用。

## 异常处理

理论上所有 API 调用都有可能抛出异常，因此需要通过 try-catch 进行异常处理，例如：

```cpp
try {
    send_private_message(12345678, "你好！");
} catch (ApiError &err) {
    logging::warning("私聊", "发送失败，错误码：" + to_string(err.code));
}
```

当然，有一些 API，例如 `get_login_user_id`、`get_login_nickname`、`get_app_directory` 等和 `logging` 模块，发生错误的可能性较低，几乎可以认为不会抛出异常，对这些 API 可以不进行异常处理。

## 一些例子

```cpp
send_private_message(12345678, "你好！"); // 发送私聊消息

auto msg_id = send_message(event.target, "你好呀～"); // 发送消息到触发事件的主体
delete_message(msg_id); // 撤回刚刚发送的消息

delete_message(event.message_id); // 撤回群成员发送的消息

if (event.message == "脏话") {
    set_group_ban(event.group_id, event.user_id, 30 * 60); // 说脏话禁言 30 分钟
}

set_group_anonymous_ban(event.group_id, event.anonymous.flag, 30 * 60); // 禁言匿名用户 30 分钟

if (event.comment == "暗语") {
    set_friend_request(event.flag, RequestEvent::Operation::APPROVE); // 同意好友请求
}

set_group_request(event.flag, event.sub_type, RequestEvent::Operation::REJECT, "我不同意～"); // 拒绝群请求

vector<Group> groups = get_group_list(); // 获取群列表
send_group_message(groups[0].group_id, "这是第一个群！"); // 发送群消息
```

这里只是展示一些 API 调用的参数传递，省略了异常处理，你在自己的代码中应该加上。
