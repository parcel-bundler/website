# 📦 Упаковщики

В Parcel `Packager` объединяет несколько `Assets` вместе в конечный выходной бандл. Это происходит в основном процессе после того, как все ресурсы обработаны и создано дерево бандлов. Упаковщики регистрируются на основе типа выходного файла, а ресурсы, которые сгенерировали этот тип вывода, отправляются этому бандлу для создания окончательного выходного файла.

## Интерфейс упаковщика

```javascript
const {Packager} = require('parcel-bundler');

class MyPackager extends Packager {
  async start() {
    // (опционально) запись заголовока файла, если это необходимо.
    await this.dest.write(header);
  }

  async addAsset(asset) {
    // запись ресурса в выходной файл.
    await this.dest.write(asset.generated.foo);
  }

  async end() {
    // (опционально) при необходимости напишите окончание файла.
    await this.dest.end(trailer);
  }
}
```

## Регистрация упаковщика

Вы можете зарегистрировать упаковщик с помощью метода `addPackager`. Он принимает тип файла для регистрации и путь к вашему модулю упаковщика.

```javascript
const Bundler = require('parcel-bundler');

let bundler = new Bundler('input.js');
bundler.addPackager('foo', require.resolve('./MyPackager'));
```
