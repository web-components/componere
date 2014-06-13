# Components Framework
É um webframework para construção de webcomponents.

## Instalação
Para instalar, basta incluir o arquivo components.min.js na pagina html.

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script type="text/javascript" src="https://raw.githubusercontent.com/web-components/components/master/components.min.js"></script>
</head>
<body>
</body>
</html>
```

## Utilização básica
Os componentes são declarados no arquivo html sempre com os atributos type e id. O type dos componentes já são as URIs que irão fornecer o código do componente, portanto, o próprio framework resolve o type, instala o componente e inicia.

```html
<component type="https://raw.githubusercontent.com/web-components/components/master/examples/example1/timer.js" id="myTimer"></component>
```

### Meu primeiro componente
Para construir um componente, basta acessar o contrutor que o framework disponibiliza no escopo global da aplicação javascript. O construtor sempre deve receber o id do componente que conforme explicado na utilização básica deve sempre ser a URI do componente.

```js
var MyFirstComponent;
MyFirstComponent = new Component('http://my-awsome-domain.com/my-first-component');
```

E para acessar o componente agora, basta inclui-lo na sua página html.

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script type="text/javascript" src="./components.min.js"></script>
</head>
<body>
    <component type="http://my-awsome-domain.com/my-first-component" id="myFirstComponentInstance"></component>
</body>
</html>
```
