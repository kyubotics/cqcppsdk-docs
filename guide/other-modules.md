# 其它实用模块

## `dir` 模块

可用于获取 酷Q 主目录、应用目录、应用子目录、每个账号独立的应用子目录等（结尾总是包含 `\`）。

例如：

```cpp
dir::root() // C:\Users\Username\Apps\酷Q Air\
dir::app() // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\
dir::app("log") // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\log\
dir::app_per_account() // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\12345678\
dir::app_per_account("log") // C:\Users\Username\Apps\酷Q Air\data\app\com.example.demo\12345678\log\
```

当上面获取的目录不存在时，将会创建。
