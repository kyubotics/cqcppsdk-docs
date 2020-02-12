# 内置条件

所有内置条件都在 `dolores::cond` 命名空间中。

## `Not` 要求事件不满足特定条件

- **用于**：任意事件
- **示例**：
  ```cpp
  Not(contains("abc"))
  ```

## `And` 要求事件同时满足两个特定条件（有短路效应）

- **用于**：任意事件
- **示例**：
  ```cpp
  And(contains("a"), contains("b")) // 等价于 contains("a") & contains("b")
  ```

## `Or` 要求事件满足两个特定条件中至少一个（有短路效应）

- **用于**：任意事件
- **示例**：
  ```cpp
  Or(contains("a"), contains("b")) // 等价于 contains("a") | contains("b")
  ```

## `All` 要求事件同时满足若干个特定条件

- **用于**：任意事件
- **示例**：
  ```cpp
  All(contains("a"), contains("b"), contains("c"))
  ```

## `type` 要求事件是特定类型

- **用于**：任意事件
- **示例**：
  ```cpp
  type<cq::PrivateMessageEvent>
  ```

## `unblocked` 要求事件没有被阻止传递

- **用于**：任意事件
- **示例**：
  ```cpp
  unblocked()
  ```

## `startswith` 要求消息以特定字符串开头

- **用于**：消息事件
- **示例**：
  ```cpp
  startswith("prefix")
  ```

## `endswith` 要求消息以特定字符串结尾

- **用于**：消息事件
- **示例**：
  ```cpp
  startswith("suffix")
  ```

## `contains` 要求消息包含特定字符串

- **用于**：消息事件
- **示例**：
  ```cpp
  contains("sub string")
  ```

## `command` 要求消息是命令调用

- **用于**：消息事件
- **示例**：
  ```cpp
  command("echo")
  command("echo", {"", "/", "!"}) // 可通过第二个参数修改命令起始符
  ```

## `user` 要求事件由特定用户触发（不限制私聊或群）

- **用于**：任意事件
- **示例**：
  ```cpp
  user({10001000, 10001001})
  ```

## `user::exclude` 要求事件不是由特定用户触发（不限制私聊或群）

- **用于**：任意事件
- **示例**：
  ```cpp
  user::exclude({10001000, 10001001})
  ```

## `direct` 要求事件由私聊触发

- **用于**：任意事件
- **示例**：
  ```cpp
  direct()
  direct({10001000, 10001001}) // 可要求特定用户，类似 user 条件
  ```

## `direct::exclude` 要求事件不是由特定用户私聊触发

- **用于**：任意事件
- **示例**：
  ```cpp
  direct::exclude({10001000, 10001001})
  ```

## `group` 要求事件由群触发

- **用于**：任意事件
- **示例**：
  ```cpp
  group()
  group({10001000, 10001001}) // 可要求特定群，类似 user 条件
  ```

## `group::exclude` 要求事件不是由特定群触发

- **用于**：任意事件
- **示例**：
  ```cpp
  group::exclude({10001000, 10001001})
  ```

## `discuss` 要求事件由讨论组触发

- **用于**：任意事件
- **示例**：
  ```cpp
  discuss()
  ```

## `group_roles` 要求事件由群特定角色触发（不限制非群事件）

- **用于**：任意事件
- **示例**：
  ```cpp
  group_roles({cq::GroupRole::MEMBER}) // 要求事件由普通群成员触发
  group_roles({cq::GroupRole::OWNER}) // 要求事件由群主触发
  ```

## `admin` 要求事件由群管理员触发（不限制非群事件）

- **用于**：任意事件
- **示例**：
  ```cpp
  admin() // 等价于 group_roles({cq::GroupRole::ADMIN, cq::GroupRole::OWNER})
  ```

## `owner` 要求事件由群主触发（不限制非群事件）

- **用于**：任意事件
- **示例**：
  ```cpp
  owner() // 等价于 group_roles({cq::GroupRole::OWNER})
  ```
