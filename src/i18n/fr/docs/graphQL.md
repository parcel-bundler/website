# GraphQL

_Extensions supportées : `gql`, `graphql`_

Vous pouvez importer directement un fichier graphql dans votre code :

```graphql
# schema.graphql
type Query {
  hello: String
}
```

```js
import schema from './schema.graphql'
```

`schema` est maintenant un document GraphQL

Vous pouvez également utiliser les imports :

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
