# 其它实用模块

## `logging` 模块

用于向 酷Q 日志窗口写入日志。例如：

```cpp
logging::debug("标签", "Debug 日志");
logging::info("标签", "Info 日志");
logging::info_success("标签", "Info 成功日志");
logging::info_recv("标签", "Info 接收日志");
logging::info_send("标签", "Info 发送日志");
logging::warning("标签", "Warning 日志"); // 会导致 酷Q 弹出警告气泡
logging::error("标签", "Error 日志"); // 会导致 酷Q 弹出错误气泡
logging::fatal("标签", "Fatal 日志"); // 会导致 酷Q 弹出错误窗口，确定后退出
```

## `dir` 模块

用于获取 酷Q 主目录、应用目录、应用子目录、每个账号独立的应用子目录等（结尾总是包含 `\`）。例如：

```cpp
dir::root() // C:\Users\Username\Apps\酷Q Air\
dir::app() // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\
dir::app("log") // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\log\
dir::app_per_account() // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\12345678\
dir::app_per_account("log") // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\12345678\log\
```

当上面获取的目录不存在时，将会创建。
