# 介绍

Dolores 是在 SDK 的基本接口之上再次抽象封装的一层接口。它和基本接口的区别在于：基本接口忠于 酷Q 所提供的原始接口，而 Dolores 提供了更方便的封装。

目前 Dolores 接口还在测试阶段，可能不稳定，接口也可能发生变动，请谨慎使用。

## 特点

- **抽象**，无需关注 酷Q 事件的细枝末节
- **直观**，凭感觉就可以写出正确的代码
- **快捷**，仅简单几行就能实现像样的功能

## 一瞥

```cpp
#include <dolores/dolores.hpp>

using namespace dolores::matchers;

dolores_on_message("Echo 命令", command("echo")) {
    current.send(current.command_argument());
}
```
