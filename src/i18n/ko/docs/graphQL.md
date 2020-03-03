# GraphQL

_지원되는 확장자: `gpl`, `graphql`_

graphql 파일을 코드에 바로 임포트 할 수 있습니다.

```graphql
# schema.graphql
type Query { hello: String }
```

```js
import schema from './schema.graphql'
```

`schema`는 GraphQL 문서입니다.

또한, 이러한 형태로 임포트가 가능합니다.

```graphql
# Foo.graphql
type Foo { bar: String }
```

```graphql
# schema.graphql

# import "./Foo.graphql"

type Query { foo: Foo }
```
