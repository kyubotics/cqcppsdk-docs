# 基本用法

前面的 [一些例子](/dolores/examples.md) 中已经给出了一些使用 Matcher 的例子，这里再总结一下。

## Matcher 的作用

Matcher 用于限制事件处理程序的进入条件，Dolores 在决定是否需要运行某个处理程序之前，会先调用处理程序的 Matcher 来尝试匹配，只有 Matcher 匹配成功，才会运行处理程序。

## 逻辑运算

Matcher 之间支持使用 `!`、`&&`、`||` 进行逻辑运算，运算结果仍然是 Matcher，并且，通过 `&&` 和 `||` 组合的 Matcher 在进行匹配时，具有和普通的逻辑与、逻辑或运算相同的短路效应。

## Matcher 的组合

通过逻辑运算可以将不同的 Matcher 组合成一个，一些 Matcher 也支持使用其它 Matcher 作为参数（例如 `to_me`），通过这些方式可以产生新的 Matcher，保存成全局变量后可以多次使用，例如：

```cpp
const auto group_admin_only = group() && admin();

const auto to_me_command = [](const std::string &name) {
  return to_me(command(name));
};

dolores_on_message("Ban 命令", to_me_command("ban"), group_admin_only) {
    // ...
}
```

## MessageMatcher

MessageMatcher 是一类特殊的 Matcher，专门用于匹配消息，例如 `startswith`、`contains`、`command`。通常情况下，不用刻意区分 MessageMatcher 和其它 Matcher，因为它们使用起来几乎一样，逻辑运算符也可以正确运算。

但在一种情况下，需要区分 MessageMatcher，即用在 `to_me` Matcher 的参数时。这是因为 `to_me` 需要先匹配到@，然后去掉开头或结尾的@，再匹配剩余部分，这要求 Matcher 参数必须是 MessageMatcher。另外，`to_me` 的参数中可以使用逻辑运算的结果，因为 MessageMatcher 之间的逻辑运算结果仍然是 MessageMatcher。
