# 开始之前

在开始使用 CoolQ C++ SDK 开发 酷Q 应用之前，请先确保你已经了解 酷Q 的基本使用，和应用开发的基本流程。

## 关于 酷Q 的一些常识

酷Q 的首页在 [https://cqp.cc](https://cqp.cc)。

酷Q 分为 Air 版和 Pro 版，Air 版提供免费的基本功能，Pro 版提供付费的高级功能，两者均可以在 酷Q 社区（[https://cqp.cc/forum.php](https://cqp.cc/forum.php)）下载。

对于非 Windows 操作系统，酷Q 可运行在 Docker 容器内，见 [酷Q on Docker](https://cqp.cc/t/34558)。

登录 酷Q 时，应使用 QQ 小号，而不是你的大号。第一次登录后会有一个互动式教程，如果你是第一次使用 酷Q，请一定要跟着教程走一遍。

可以在 酷Q 社区的应用发布板块（[https://cqp.cc/b/app](https://cqp.cc/b/app)）找到其他开发者发布的各种应用。

在使用过程中遇到任何问题，可以在 [https://cqp.cc/b/cq](https://cqp.cc/b/cq) 发帖询问，或加入 酷Q 官方 QQ 群交流（可在下载贴内找到群号）。

## 关于 酷Q 应用开发的一些常识

已发布的 酷Q 应用是 CPK 格式，扩展名为 `.cpk`。开发模式的 酷Q 应用是 DLL 格式，即动态链接库，扩展名为 `.dll`。

开发 酷Q 应用就是要编译出动态链接库 `app.dll`，并在 JSON 描述文件 `app.json` 中填写应用版本、作者、应用描述、导出函数名、菜单项、权限等，然后将两者放入 酷Q 的 `dev/<你的应用Id>` 目录中。当 酷Q 处于开发模式时，会加载 `dev` 目录中的开发模式应用，使用起来和 CPK 一致。

当开发完成后，可在 酷Q 的应用管理窗口，点击「开发」-「打包应用」来将 DLL 和 JSON 打包为 CPK 文件，之后分发给你的用户或公开发布在 酷Q 社区。

**在开始使用本 SDK 之前，请先粗略阅读 酷Q 开发文档（[https://docs.cqp.im/](https://docs.cqp.im/)），从而对 酷Q 应用开发有一个基本的感性认识。**
