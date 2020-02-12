# 自定义条件

## 组合已有条件

使用 `&`、`|` 运算符和 `Not`、`All` 等条件可以很容易地组合已有的条件，构造新的条件。例如：

```cpp
const auto group_admin_only = group() & admin();
const auto contains_dirty_words = contains("脏话1") | contains("脏话2") | contains("脏话3");
const auto not_contains_dirty_words = Not(contains_dirty_words);
// ...

dolores_on_message(ban, command("ban"), group_admin_only) {
    // ...
}
```

## 编写新的条件

条件本质上是 `dolores::Condition` 对象，通过继承该类可以编写自定义条件，请参考 `dolores/condition.hpp`。
