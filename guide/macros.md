# 两个重要宏

## `CQ_INIT`

本质上会构造一个初始化函数，只能使用一次，将在初始化事件发生之前运行，使用方法如下：

```cpp
CQ_INIT {
    on_enable([] {
        logging::info("启用", "插件已启用");
    });
}
```

除了注册事件处理函数，还可以在该函数中初始化全局变量等。

**但是注意，不可以在 `CQ_INIT` 的最外层调用任何 API，包括调用 `logging` 模块，因为该初始化函数运行时，酷Q 还没有完成应用加载。例如下面这样是错的：**

```cpp
CQ_INIT {
    send_private_message(12345678, "我上线了！"); // 这是不可以的，应该在应用启用事件中调用
}
```

## `CQ_MENU`

用于定义菜单项点击处理函数，可以多次使用，使用方法如下：

```cpp
CQ_MENU(menu_demo_1) {
    logging::info("菜单", "点击菜单1");
}
```

需要注意的是，`CQ_MENU` 的参数必须和 `app.json` 的 `menu` 中的 `function` 对应。

`CQ_MENU` 中可以做任何事情，包括调用 酷Q API、调用 Windows API、发起网络请求等。
