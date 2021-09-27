---
layout: layout.njk
title: GraphQL
eleventyNavigation:
  key: languages-graphql
  title: <img src="/assets/lang-icons/graphql.svg" alt=""/> GraphQL
  order: 13
---

Parcel supports importing [GraphQL](https://graphql.org) queries defined in a separate file into JavaScript via the `@parcel/transformer-graphql` plugin.  When a `.graphql` or `.gql` file is detected, it will be installed into your project automatically.

## Example usage

GraphQL files are imported into JavaScript as a string, which you can send to a server directly or use with whatever GraphQL library you like.

{% sample %}
{% samplefile "app.js" %}

```js
import query from './query.graphql';
```

{% endsamplefile %}
{% samplefile "query.graphql" %}

```graphql
{
  user(id: 5) {
    firstName,
    lastName
  }
}
```

{% endsamplefile %}
{% endsample %}

### Dependencies

Parcel also supports importing fragments defined in separate files into another GraphQL file using a special comment syntax. These will be bundled together into a single GraphQL query and returned to your code as a string.

You can either import all fragments from a file:

```graphql
# import "fragments.graphql"
# import * from "fragments.graphql"
```

or list the specific fragments you wish to import:

```graphql
# import UserFragment, AddressFragment from "fragments.graphql"
```

Here is a full example showing how to use imports as part of a larger GraphQL query:

{% sample %}
{% samplefile "query.graphql" %}

```graphql
# import UserFragment from "user.graphql"
# import "address.graphql"

query UserQuery($id: ID) {
  user(id: $id) {
    ...UserFragment
    address {
      ...Address
    }
  }
}
```

{% endsamplefile %}
{% samplefile "user.graphql" %}

```graphql
fragment UserFragment on User {
  firstName
  lastName
}
```

{% endsamplefile %}
{% samplefile "address.graphql" %}

```graphql
fragment AddressFragment on Address {
  city
  state
  country
}
```

{% endsamplefile %}
{% endsample %}
