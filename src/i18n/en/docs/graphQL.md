# GraphQL

_Supported extensions: `gql`, `graphql`_

You can import directly a graphql file into your code:

```graphql
# schema.graphql
type Query { hello: String }
```

```js
import schema from './schema.graphql'
```

`schema` is now a GraphQL Document

You can also use imports:

```graphql
# Foo.graphql
type Foo { bar: String }
```

```graphql
# schema.graphql

# import "./Foo.graphql"

type Query { foo: Foo }
```
