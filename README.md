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
<component type="https://raw.githubusercontent.com/web-components/components/master/examples/example1/timer.js" id="myTimer">
```
