---
layout: layout.njk
eleventyNavigation:
  key: plugin-system-resolver
  title: Resolver
  order: 4
---

Resolver plugins are responsible for turning a dependency specifier into a full file path that will be processed by transformers. Resolvers run in a pipeline until one of them returns a result. See [Dependency resolution](/features/dependency-resolution/) for details on how the default resolver works.

## Example

This example overrides the resolution of `special-module`, and otherwise returns `null` to allow the next resolver in the pipeline to handle the dependency. See [Resolvers](/features/plugins/#resolvers) in the Parcel configuration docs for details on how this works.

```javascript
import {Resolver} from '@parcel/plugin';
import path from 'path';

export default new Resolver({
  async resolve({specifier}) {
    if (specifier === 'special-module') {
      return {
        filePath: path.join(__dirname, 'special-module.js')
      };
    }

    // Let the next resolver in the pipeline handle 
    // this dependency.
    return null;
  }
});
```

## Virtual modules

Rather than resolving to a file on the file system, Resolvers may also return `code` directly. This allows programmatically generating virtual modules on demand. You must still return a `filePath` as well, however, as this indicates where any dependencies in the code should be resolved relative to, as well as how the source code should be processed by transformers (e.g. by file extension).

```javascript/8
import {Resolver} from '@parcel/plugin';
import path from 'path';

export default new Resolver({
  async resolve({specifier}) {
    if (specifier === 'special-module') {
      return {
        filePath: path.join(__dirname, 'special-module.js'),
        code: 'export default "This is a special module!";'
      };
    }

    return null;
  }
});
```

## Dependency metadata

In addition to the `specifier`, Resolver plugins also receive a full [`Dependency`](/plugin-system/transformer/#Dependency) object, which includes additional metadata about the dependency. The `specifierType` property indicates how the `specifier` should be interpreted (e.g. ESM, CommonJS, URL, etc.). The `resolveFrom` property specifies the file path where the dependency should be resolved from (e.g. if the specifier is a relative path).

This example resolves relative URLs and paths depending on the `specifierType`.

```javascript
import {Resolver} from '@parcel/plugin';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';

export default new Resolver({
  async resolve({specifier, dependency}) {
    return {
      filePath: dependency.specifierType === 'url'
        ? fileURLToPath(
          new URL(specifier, pathToFileURL(dependency.resolveFrom))
        )
        : path.resolve(dependency.resolveFrom, specifier)
    };
  }
});
```

## Excluding modules

The `isExcluded` property can be returned to indicate that a module should be excluded from the build. This example excludes `aws-sdk` which is included in the AWS hosting environment automatically and does not need to be bundled.

```javascript/5
import {Resolver} from '@parcel/plugin';

export default new Resolver({
  async resolve({specifier}) {
    if (specifier === 'aws-sdk') {
      return {isExcluded: true};
    }

    return null;
  }
});
```

## Cache invalidation

The results of Resolver plugins are cached by Parcel automatically. If you read any files from the file system during resolution, you’ll need to tell Parcel about them so it can watch them and invalidate the resolution when they change.

The `invalidateOnFileChange` property should be set to an array of all files that were successfully read during resolution. The `invalidateOnFileCreate` property should be set to an array of [`FileCreateInvalidation`](/plugin-system/api/#FileCreateInvalidation) objects describing files that should invalidate the resolution if they were created.

```javascript/12,16
import {Resolver} from '@parcel/plugin';
import path from 'path';

export default new Resolver({
  async resolve({specifier, options}) {
    let aliasFile = path.join(options.projectRoot, 'alias.json');

    try {
      let aliasConfig = await options.inputFS.readFile(aliasFile);
      let aliases = JSON.parse(aliasConfig);
      return {
        filePath: aliases[specifier] || null,
        invalidateOnFileChange: [aliasFile]
      };
    } catch (err) {
      return {
        invalidateOnFileCreate: [{filePath: aliasFile}]
      };
    }
  }
});
```

## Diagnostics

A Resolver plugin may encounter errors during resolution. When this happens, it may either `throw` an error or return `diagnostics`. If a Resolver throws, the resolution process is immediately halted, and the error is shown to the user.

If a Resolver instead returns `diagnostics`, resolution continues to the next Resolver plugin. If none of the Resolver plugins are able to resolve the dependency, then all diagnostics from all Resolver plugins are shown to the user.

```javascript/17-20
import {Resolver} from '@parcel/plugin';
import path from 'path';

export default new Resolver({
  async resolve({specifier, options}) {
    let aliasFile = path.join(options.projectRoot, 'alias.json');

    try {
      let aliasConfig = await options.inputFS.readFile(aliasFile);
      let aliases = JSON.parse(aliasConfig);
      return {
        filePath: aliases[specifier] || null,
        invalidateOnFileChange: [aliasFile]
      };
    } catch (err) {
      return {
        invalidateOnFileCreate: [{filePath: aliasFile}],
        diagnostics: [
        {
          message: 'Could not read alias.json',
          hints: ['Create an alias.json file in the project root.']
        }]
      };
    }
  }
});
```

See [Diagnostics](/plugin-system/logging/#diagnostics) for more detail.

## Side effects

Resolvers may also return a `sideEffects` property which indicates whether the asset may have side effects when executed. This usually corresponds to the same property in `package.json`, and is used for [scope hoisting](/features/scope-hoisting/).

## Relevant API

{% include "../../api/resolver.html" %}
