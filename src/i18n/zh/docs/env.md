# 🌳 环境变量

Parcel 使用[dotenv](https://github.com/motdotla/dotenv)支持从`.env`文件加载环境变量。

`.env`与`package.json`储存在一起，将包含在你的`parcel-bundler`依赖项

Parcel 根据下表`NODE_ENV`的值来加载具体名字的`.env`文件

| 合法的 `.env` 文件名     | `NODE_ENV=*` | `NODE_ENV=test` |
| ------------------------ | ------------ | --------------- |
| `.env`                   | ✔️           | ✔️              |
| `.env.local`             | ✔️           | ✖️              |
| `.env.${NODE_ENV}`       | ✔️           | ✔️              |
| `.env.${NODE_ENV}.local` | ✔️           | ✔️              |

注意：

- `NODE_ENV` 默认是 `development`.
- 当`NODE_ENV=test`时`.env.local`不会加载，因为 [测试应该对每个人产生相同的结果](https://github.com/parcel-bundler/parcel/blob/28df546a2249b6aac1e529dd629f506ba6b0a4bb/src/utils/env.js#L9)
- 有时引入一个新的.env 文件不会立即生效。这种情况下尝试删除.cache 文件夹
