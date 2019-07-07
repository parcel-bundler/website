# GraphQL

_支援的副檔名：`gql` 及 `graphql`_

你可以直接在程式中匯入 graphql 檔案：

```graphql
# schema.graphql
type Query { hello: String }
```

```js
import schema from './schema.graphql'
```

`schema` 就是 GraphQL Document 了。你也可以直接 import

```graphql
# Foo.graphql
type Foo { bar: String }
```

```graphql
# schema.graphql

# import "./Foo.graphql"

type Query { foo: Foo }
```
