# 📦 Packagers

在 Parcel 中， `Packager` 會將多個資源 (`Asset`) 合併輸出至最終的 bundle 裡，這個過程會發生在主程序，於所有資源被處理且 bundle 樹建立之後。

Packager 的註冊是基於輸出檔案的類型，資源則會被送至處理其檔案類型的 Packager 中產生最終輸出檔案。

## Packager 介面

```javascript
const { Packager } = require('parcel-bundler')

class MyPackager extends Packager {
  async start() {
    // 非必要，寫入至檔案頂部。
    await this.dest.write(header)
  }

  async addAsset(asset) {
    // 必要項，將資源寫入至輸出檔案。
    await this.dest.write(asset.generated.foo)
  }

  async end() {
    // 非必要，寫入至檔案尾部。
    await this.dest.end(trailer)
  }
}

module.exports = MyPackager
```

## 註冊一個 Packager

你可以使用 `addPackager` 方法向 Parcel 註冊一個 Packager，此方法接受兩個參數，一個為欲註冊的檔案類型，另一個為 packager 模組的路徑。

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addPackager('foo', require.resolve('./MyPackager'))
```
