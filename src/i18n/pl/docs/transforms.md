# 🐠 Transformacje

Inne programy tworzące pakiety wymagają instalacji i konfiguracji wtyczek by dokonywać transformacji zasobów, ale Parcel od razu wspiera wiele popularnych transformacji i transpilerów. Możesz transformować JavaScript używając [Babel](https://babeljs.io), CSS używając [PostCSS](http://postcss.org) i HTML używając [PostHTML](https://github.com/posthtml/posthtml). Parcel automatycznie uruchamia te transformacje, kiedy znajdzie pliki konfiguracyjne (np. `.babelrc`, `.postcssrc`) w module.

To zachowanie działa nawet w `node_modules`: jeśli plik konfiguracyjny jest opublikowany jako część paczki, transformacje są automatycznie dokonywane na tym i tylko tym module. To zapewnia szybkie czasu tworzenia pakietów, ponieważ tylko pakiety rzeczywiście potrzebujące transformacji są procesowane. To oznacza także, że nie musisz manualnie konfigurować transformacji tak, by włączały lub wyłączały poszczególne pliki, ani nie musisz wiedzieć jak kod pochodzący od osób trzecich ma być budowany, by użyć go w swojej aplikacji.

## Babel

[Babel](https://babeljs.io) jest popularnym transpilerem dla JavaScript z ogromnym ekosystemem wtyczek. Używanie Babel z Parcel działa tak samo jak używanie go bezpośrednio lub z innymi programami tworzącymi pakiety.

Zainstaluj presety i wtyczki w aplikacji wykonując:

```bash
yarn add babel-preset-env
```

Następnie utwórz plik `.babelrc`:

```json
{
  "presets": ["env"]
}
```

## PostCSS

[PostCSS](http://postcss.org) to narzędzie do transformacji CSS z użyciem wtyczek, np.  [autoprefixer](https://github.com/postcss/autoprefixer), [cssnext](http://cssnext.io/) czy [CSS Modules](https://github.com/css-modules/css-modules). Możesz skonfigurować PostCSS z Parcel tworząc plik konfiguracyjny o jednej z nazw: `.postcssrc` (JSON), `.postcssrc.js` lub `postcss.config.js`.

Zainstaluj wtyczki w aplikacji wykonując:

```bash
yarn add postcss-modules autoprefixer
```

Następnie utwórz plik `.postcssrc`:

```json
{
  "modules": true,
  "plugins": {
    "autoprefixer": {
      "grid": true
    }
  }
}
```

Wtyczki są wymienione w obiekcie `plugins` jako klucze, a ich opcje są definiowane z użyciem wartości. Jeśli nie istnieje potrzeba określania opcji dla wtyczki, ustaw jej wartość na `true`.

Docelowe przeglądarki dla Autoprefixer, cssnext i innych narzędzi mogą być zdefiniowne w pliku `.browserslistrc`:

```
> 1%
last 2 versions
```

Moduły CSS są włączane w nieco inny sposób za pomocą klucza `modules` na najwyższym poziomie. Jest tak dlatego, ponieważ Parcel potrzebuje specjalnego wsparcia dla modułów CSS, ponieważ są one eksportowane do obiektu, który umieszczany jest w paczce JavaScript. Pamiętaj, że musisz wciąż zainstalować `postcss-modules` w swoim projekcie.

## PostHTML

[PostHTML](https://github.com/posthtml/posthtml) to narzędzie do transformowania HTML za pomocą wtyczek. Możesz skonfigurować PostHTML z Parcel tworząc plik konfiguracyjny o jednej z nazw: `.posthtmlrc` (JSON), `posthtmlrc.js` lub `posthtml.config.js`.

Zainstaluj wtyczki w aplikacji wykonując:

```bash
yarn add posthtml-img-autosize
```

Następnie utwórz plik `.posthtmlrc`:

```json
{
  "plugins": {
    "posthtml-img-autosize": {
      "root": "./images"
    }
  }
}
```

Wtyczki są wymienione w obiekcie `plugins` jako klucze, a ich opcje są definiowane z użyciem wartości. Jeśli nie istnieje potrzeba określania opcji dla wtyczki, ustaw jej wartość na `true`.

## TypeScript
[TypeScript](https://www.typescriptlang.org/) to typowany nadzbiór JavaScript, który kompiluje się do JavaScript, który wspira także funkcje ES2015+. Transformacja TypeScript działa od razu bez żadnej dodatkowej konfiguracji.

```html
<!-- index.html -->
<html>
<body>
  <script src="./index.ts"></script>
</body>
</html>
```
```typescript
// index.ts
import message from "./message";
console.log(message);
```
```typescript
// message.ts
export default "Hello, world";
```
