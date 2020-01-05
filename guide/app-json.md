# app.json

`app.json` 是用于描述 酷Q 应用的一些基本信息、导出函数名、所用权限等的文件。其中的字段及含义请参考 酷Q 开发文档的 [app.json](https://docs.cqp.im/dev/v9/app.json/) 和项目模板的 [`app.json`](https://github.com/cqmoe/cqcppsdk-template/blob/master/app.json)。

这里主要介绍几个与 SDK 有关的字段。

## `event`

`event` 中的内容可参考 酷Q 开发文档的 [event](https://docs.cqp.im/dev/v9/app.json/event/)，但需要注意，不要修改 `type`、`function`，也不要删除数组元素。

通常这里只需要根据应用类型修改 `priority` 即可。

## `menu`

`menu` 中每个对象表示一个菜单项，其中，`name` 任意，`function` 必须和 `CQ_MENU` 宏调用的参数相同。

## `auth`

`auth` 中每个元素表示需要使用的一个权限，应当在项目模板的 `app.json` 的基础上，根据应用实际的 API 调用情况对相应的项加注释或取消注释。

如果调用了某个需要权限的 API，而这里没有声明，则 酷Q 会报错。
