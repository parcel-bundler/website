# 📝 資源類型

如同 [資源](assets.html) 一章所述，Parcel 視每個輸入的檔案為一個 `資源` (Asset)。
資源類型代表著從 `資源` 類別繼承而來的類別，其實作了必要的介面以分析相依套件、轉換及產生程式碼。

Parcel 利用多核心並行處理資源，因此僅能進行同一時間處理單一檔案的資源類型轉換。若需轉換多種檔案則需自訂一個 [Packager](packagers.html)。

## 資源介面

```javascript
const { Asset } = require('parcel-bundler')

class MyAsset extends Asset {
  type = 'foo' // 設定主要輸出類別

  async parse(code) {
    // 將程式碼解析為抽象語法樹 (AST)
    return ast
  }

  async pretransform() {
    // 非必要。在收集相依套件之前進行轉換
  }

  collectDependencies() {
    // 分析相依套件
    this.addDependency('my-dep')
  }

  async transform() {
    // 非必要。在收集相依套件後進行轉換
  }

  async generate() {
    // 產生程式碼。必要時可回傳多個轉換結果。
    // 結果將會傳給適當的 Packager 進行最終打包。
    return [
      {
        type: 'foo',
        value: 'my stuff here' // 主要輸出
      },
      {
        type: 'js',
        value: 'some javascript', // 若有需要可將此轉換結果一同打包
        sourceMap
      }
    ]
  }

  async postProcess(generated) {
    // 在產生程式碼後進行處理，可用來組合多種類型的資源
  }
}

module.exports = MyAsset
```

## 註冊資源類型

你可以使用 `addAssetType` 方法在打包工具中註冊你的資源類型，其接受欲註冊的副檔名及你的資源類型模型路徑。
為了將模型傳遞至 worker 中執行，這裡僅需傳入路徑而非實際的物件。

```javascript
const Bundler = require('parcel-bundler')

let bundler = new Bundler('input.js')
bundler.addAssetType('.ext', require.resolve('./MyAsset'))
```
