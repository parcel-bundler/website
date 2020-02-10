# 🛠️ 除錯

Parcel 預設會自動產生 sourcemaps，因此設定除錯只需要少少的設定。

## Chrome 開發者工具

當 Source Maps 啟用時無需另外設定即可使用。

假設你有下列的檔案結構：

```
├── package-lock.json
├── package.json
└── src
    ├── index.html
    └── index.ts
```

而 `index.ts` 的內容是：

```Typescript
const variable: string = "Hello, World!";

document.getElementById("greeting").innerHTML = variable;
```

`index.html` 的內容則是：

```HTML
<!DOCTYPE html>
<html>
  <head>
    <title>Chrome 除錯範例</title>
  </head>
  <body>
    <h1 id="greeting"></h1>
    <script src="./index.ts"></script>
  </body>
</html>
```

（`package.json` 中僅安裝 `parcel-bundler`）

如此一來你就可以執行 `parcel src/index.html` 並在原始碼中設定中斷點，如下圖：

![Chrome 中斷點範例](https://user-images.githubusercontent.com/30810402/67711207-dd519500-f997-11e9-987a-570d1ce677d4.png)

## Visual Studio Code

假設檔案結構與 Chrome 開發者工具一節中的類似，則可在 [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) 外掛中使用下列 `launch.json` 設定：

```js
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:1234",
      "webRoot": "${workspaceFolder}",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "../*": "${webRoot}/*"
      }
    }
  ]
}
```

接著你需要在進入點啟動 Parcel 開發伺服器，此例的進入點是 `index.html`：

```
$ parcel src/index.html
```

最後一步就是按下除錯面板的箭頭來啟動除錯程序。現在你應該可以在原始碼中設定中斷點了，最後結果將會如下圖所示：

![VSCode 除錯範例](https://user-images.githubusercontent.com/30810402/67711603-ad56c180-f998-11e9-8cee-637fe5537643.png)
