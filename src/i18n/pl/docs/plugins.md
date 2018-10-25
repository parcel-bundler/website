# 🔌 Wtyczki

Parcel ma nieco inne podejście od wielu innych narzędzi, ponieważ wiele popularnych formatów jest od razu wspieranych bez potrzeby instalacji i konfiguracji dodatkowych wtyczek. Istnieją jednak przypadki, w których niestandardowe rozszerzenie funkcjonalności Parcel może być konieczne. Na takie okazje w Parcel przygotowane zostało wsparcie dla wtyczek. Zainstalowane wtyczki są automatycznie wykrywane i wczytywane na podstawie zależności w `package.json`.

Dodając wsparcie dla nowego typu pliku do Parcel, powinno się najpierw rozważyć jak bardzo popularny jest to format i jak bardzo ustandardyzowana jest jego implementacja. Jeśli jest to format dostatecznie popularny i ustandaryzowany, wsparcie dla niego powinno zostać zapewne dodane do jądra Parcel, zamiast do wtyczki którą użytkownicy musieliby instalować. Jeśli masz wątpliwości, [GitHub](https://github.com/parcel-bundler/parcel/issues) jest dobrym miejscem do dyskusji.

## API Wtyczek

Wtyczki Parcel są wyjątkowo proste. To zwyczajne moduły, które eksportują pojedynczą funkcję, która wywoływana jest przez Parcel automatycznie podczas inicjalizacji. Funkcja otrzymuje na wejściu obiekt `Bundler` i może skonfigurować wtyczkę, np. rejestrując typy zasobów i programy pakujące.

```javascript
module.exports = function(bundler) {
  bundler.addAssetType('ext', require.resolve('./MyAsset'))
  bundler.addPackager('foo', require.resolve('./MyPackager'))
}
```

Opublikuj gotową paczkę na npm używając nazwy z prefiksem `parcel-plugin-`, a zostanie ona automatycznie wykryta i załadowana jak opisano poniżej.

## Używanie Wtyczek

Używanie wtyczek w Parcel nie może być prostsze. Wszystko co musisz zrobić to zainstalować je i zapisać do pliku `package.json`. Wtyczki powinny mieć nazwy z prefiksem `parcel-plugin-`, np. `parcel-plugin-foo`. Jakiekolwiek zależności w `package.json` z tym prefiksem będą automatycznie załadowane podczas inicjalizacji.
