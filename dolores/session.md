# Session

目前 Session 对象只是简单继承了 `std::map<std::string, std::any>`，并额外提供了 `get<T>(key)` 和 `get<T>(key, default_val)` 成员函数。

待填坑。
