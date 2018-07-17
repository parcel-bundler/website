# 🛠 Jak To Działa

Parcel transformuje drzewo **zasobów** do drzewa **paczek**. Wiele innych programów tworzących pakiety jest zorientowana na zasoby JavaScript, a zasoby innego typu są "przyczepione", np. wstawiane w kod JavaScript jako stringi. Parcel jest neutralny w stosunku do typu pliku - będzie działać tak samo dobrze z dowolnymi typami zasobów, bez żadnej konfiguracji. Są trzy etapy procesu pakowania Parcel.

### 1. Konstruowanie Drzewa Zasobów

Parcel bierze za plik wejściowy pojedynczy zasób, który może być dowolnego typu: plik JS, HTML, CSS, obraz itd.. Istnieją różne [typy zasobów](asset_types.html) zdefiniowane w Parcel, który wie, jak poradzić sobie z konkretnym typem pliku. Zasoby są parsowane, ich zależności ekstraktowane, a następnie są one transformowane do finalnej, skompilowanej formy. To tworzy drzewo zasobów.

### 2. Konstruowanie Drzewa Paczek

Kiedy drzewo zasobów zostanie skonstruowane, zasoby są umieszczane w drzewie paczek. Dla pliku wejściowego tworzona jest jedna paczka, a paczki potomne tworzone są dla dynamicznych `import()`ów, które powodują dzielenie kodu.

Paczki siostrzane tworzone są kiedy importowane są zasoby różnego typu. Przykładowo, jeśli z pliku JavaScript zostanie zaimportowany plik CSS, zostanie on umieszczony w paczce siostrzanej do paczki JavaScript.

Jeśli do jednego zasobu pojawią się odwołania w więcej niż jednej paczce, jest on przenoszony do najbliższego wspólnego rodzica w drzewie zasobów tak, aby nie został on umieszczony w paczce więcej niż raz.

### 3. Pakowanie

Kiedy drzewo paczek zostanie skonstruowane, każda paczka jest zapisywana do pliku za pomocą [programu pakującego](packagers.html), specyficznego dla każdego typu pliku. Programy pakujące wiedzą, jak połączyć kod z wielu zasobów do finalnego pliku, który jest ładowany przez przeglądarkę.
