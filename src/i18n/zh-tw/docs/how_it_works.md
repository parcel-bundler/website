# 🛠 運作原理

Parcel 將**資源樹** (Asset tree) 轉換為 **bundle 樹** (Bundle tree)，而其他打包工具都是以 JavaScript 資源為基礎，將其他格式的檔案附加其上，例如：將檔案轉為字串插入於 JavaScript 檔案中。

Parcel 跨越檔案類型，而且正如你想像的一樣：它不需設定就能處理任何檔案類型。

下列是 Parcel 打包流程三步驟：

### 1. 建構資源樹

Parcel 接受 JS、HTML、CSS 及影像等的任何檔案作為進入點。Parcel 內部定義了眾多[資源類型](asset_types.html)來處理特定的檔案。

資源在經過剖析、提取其相依套件及轉換為最終編譯型態的過程中會產生資源樹。

### 2. 建構 Bundle 樹

資源樹建立後，資源會被放進 bundle 樹裡，而進入點的資源 bundle 也將被建立，接著建立動態 `import()` 的子 bundle，並開始進行程式碼分離。

當匯入不同類型的資源時，則會建立旁系 bundle。舉例來說，若你從 JavaScript 中匯入 CSS 檔案，它將被放進此 JavaScript 對應的旁系 bundle。

若資源需要引入多個 bundle 時，其會被提升至 bundle 樹中最接近的共同祖先，以避免多次引入。

### 3. 打包

bundle 樹建立後，每個 bundle 將由處理其類型的 [Packager](packagers.html) 寫入檔案。Packager 知道如何將每個資源的程式碼合併至最終會被瀏覽器載入的檔案之中。
