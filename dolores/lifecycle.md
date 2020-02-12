# 生命周期

Dolores 简化了 酷Q 的生命周期事件，让你不再需要关心「应用启用」和「酷Q启动」、「应用停用」和「酷Q退出」的区别。

## 启动事件

通过 `dolores::on_startup` 可注册启动事件处理函数，例如：

```cpp
CQ_INIT {
    dolores::init();

    dolores::on_startup([] {
        // 进行资源初始化等操作
    });
}
```

## 停止事件

通过 `dolores::on_shutdown` 可注册停止事件处理函数，例如：

```cpp
CQ_INIT {
    dolores::init();

    dolores::on_shutdown([] {
        // 进行资源销毁等操作
    });
}
```
