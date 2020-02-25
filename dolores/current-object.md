# Current 对象

Current 对象封装了事件和 Matcher 数据，并根据事件类型的不同，提供不同的便捷函数。更一般地说，Current 对象封装了「**当前这次**触发事件处理程序所涉及的数据和操作」。

## `CurrentBase<E>`

所有 Current 类的基类。

### 成员变量

#### `event` 事件对象

- **类型**：`const E &`
- **生命期**：事件处理程序运行时有效
- **示例**：
  ```cpp
  auto &message = current.event.message;
  ```

#### `matcher_data` Matcher 数据

- **类型**：`dolores::StrAnyMap &`
- **生命期**：事件处理程序运行时有效
- **说明**：用于在 Matcher 中保存匹配时产生的数据，之后在事件处理程序中取出
- **示例**：
  ```cpp
  auto command_name = current.matcher_data.get<std::string_view>(command::NAME, "");
  ```

### 成员函数

#### `event_as<T>() const` 对事件对象做动态类型转换，以获取具体类型的事件

- **返回值**：`const std::decay_t<T> &`，动态类型转换后的对象
- **示例**：
  ```cpp
  const auto &event = current.event_as<cq::GroupMessageEvent>();
  ```

#### `send(const std::string &message, const bool at_user = false) const` 发送消息

- **参数**：
  - `message`：消息内容
  - `at_user`：是否在消息开头@触发事件的用户
- **返回值**：`int64_t`，消息 ID
- **示例**：
  ```cpp
  current.send("你好");
  ```

#### `reply(const std::string &message) const` 回复消息

- **说明**：等价于 `current.send(message, true)`
- **示例**：
  ```cpp
  current.reply("你好");
  ```

## `Current<E>`

Current 模板类，原样继承 `CurrentBase<E>` 的所有成员。

## `Current<cq::MessageEvent>`

Current 模板类对 `cq::MessageEvent` 的特化。

### 成员函数

#### `command_starter() const` 获取命令起始符

- **返回值**：`std::message`，用户在消息中使用的命令起始符，若该消息没有满足 `command` Matcher，则返回空字符串
- **示例**：
  ```cpp
  dolores_on_message("echo", command("echo", {"/", "!", "."})) {
      current.command_starter(); // 可能取值为 / ! .
  }
  ```

#### `command_name() const` 获取命令名

- **返回值**：`std::message`，用户在消息中使用的命令名，若该消息没有满足 `command` Matcher，则返回空字符串
- **示例**：
  ```cpp
  dolores_on_message("echo", command("echo")) {
      current.command_name(); // "echo"
  }
  ```

#### `command_argument() const` 获取命令参数

- **返回值**：`std::message`，用户在消息中传入的命令参数，若该消息没有满足 `command` Matcher，则返回空字符串
- **示例**：
  ```cpp
  dolores_on_message("echo", command("echo")) {
      current.send(current.command_argument());
  }
  ```

## `Current<cq::RequestEvent>`

Current 模板类对 `cq::RequestEvent` 的特化。

### 成员函数

#### `approve() const` 同意请求

#### `reject() const` 拒绝请求
