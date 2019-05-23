# GraphQL

_支持扩展类型: `gql`, `graphql`_

可以直接导入 graphql 文件到你的代码中：

```graphql
# schema.graphql
type Query {
  hello: String
}
```

```js
import schema from './schema.graphql'
```

现在`schema` 是一个新的 GraphQL 文档

也可以使用导入：

```graphql
# Foo.graphql
type Foo {
  bar: String
}
```

```graphql
# schema.graphql

# import "./Foo.graphql"

type Query {
  foo: Foo
}
```
