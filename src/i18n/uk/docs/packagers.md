# 📦 Пакувальники

У Parcel `Packager` об'єднує кілька`Assets` разом в кінцевий вихідний бандл. Це відбувається в основному процесі після того, як всі ресурси оброблені і створено дерево бандлів. Пакувальники реєструються на основі типу вихідного файлу, а ресурси, які згенерували цей тип виведення, відправляються в бандл для створення остаточного вихідного файлу.

## Інтерфейс пакувальника

```Javascript
const {Packager} = require('parcel-bundler');

class MyPackager extends Packager {
  async start() {
    // (опціонально) запис Тема файлу, якщо це необхідно.
    await this.dest.write(header);
  }

  async addAsset(asset) {
    // запис ресурсу у вихідний файл.
    await this.dest.write(asset.generated.foo);
  }

  async end() {
    // (опціонально) при необхідності напишіть закінчення файлу.
    await this.dest.end(trailer);
  }
}
```

## Реєстрація пакувальника

Ви можете зареєструвати пакувальник за допомогою методу `addPackager`. Він приймає тип файлу для реєстрації і шлях до вашого модуля пакувальника.

```Javascript
const Bundler = require('parcel-bundler');

let bundler = new Bundler('input.js');
bundler.addPackager('foo', require.resolve('./MyPackager'));
```
