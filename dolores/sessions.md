# 会话

会话（Session）封装了事件对象，根据事件类型的不同，提供不同的便捷函数。

## `BaseSession<E>`

所有会话的基类。

### 成员变量

#### `event` 事件对象

- **类型**：`const E &`
- **生命期**：事件处理程序运行时有效，如需保存，应当拷贝，而不是绑定
- **示例**：
  ```cpp
  auto messge = session.event.message;
  ```

#### `state` 会话状态

- **类型**：`dolores::StrAnyMap`，即 `std::map<std::string, std::any>`
- **生命期**：事件处理程序运行时有效，如需保存，应当拷贝，而不是绑定
- **说明**：用于存放各种数据，特别地，在检查事件处理程序进入条件时，条件对象可访问此对象，因此可以在自定义条件中用此对象保存数据，之后在事件处理程序中访问
- **示例**：
  ```cpp
  session.state["temp_value"] = 42;
  auto val = std::any_cast<int>(session.state.at("temp_value"));
  ```

### 成员函数

#### `event_as<T>() const` 对事件对象做动态类型转换，以获取具体类型的事件

- **返回值**：`const std::decay_t<T> &`，动态类型转换后的对象
- **示例**：
  ```cpp
  const auto &event = session.event_as<cq::GroupMessageEvent>();
  ```

#### `send(const std::string &message, const bool at_user = false) const` 发送消息

- **返回值**：`int64_t`，消息 ID
- **示例**：
  ```cpp
  session.send("你好");
  ```

#### `reply(const std::string &message) const` 回复消息

- **返回值**：`int64_t`，消息 ID
- **说明**：等价于 `session.send(message, true)`
- **示例**：
  ```cpp
  session.reply("你好");
  ```

## `MessageEvent`

封装消息事件的会话。

### 成员函数

#### `command_name() const` 获取命令名

- **返回值**：`std::message`，用户在消息中使用的命令名，如果该消息没有满足 `command` 条件，则返回空字符串
- **示例**：
  ```cpp
  dolores_on_message(echo, command("echo")) {
      // session.command_name() == "echo"
  }
  ```

#### `command_argument() const` 获取命令参数

- **返回值**：`std::message`，用户在消息中传入的命令参数，如果该消息没有满足 `command` 条件，则返回空字符串
- **示例**：
  ```cpp
  dolores_on_message(echo, command("echo")) {
      session.send(session.command_argument());
  }
  ```

## `NoticeEvent`

封装通知事件的会话。

## `RequestEvent`

封装请求事件的会话。

### 成员函数

#### `approve() const` 同意请求

#### `reject() const` 拒绝请求
