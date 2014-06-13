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
MyFirstComponent = new Component('http://my-awsome-domain.com/my-first-component.js');
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
    <component type="http://my-awsome-domain.com/my-first-component.js" id="myFirstComponentInstance"></component>
</body>
</html>
```

### Adicionando comportamento
O componente anterior não faz muita coisa além de existir no browser. Para adicionarmos um pouco de comportamento devemos olhar o ciclo de install. No ciclo de install, confome veremos mais a frente, o componente ainda não recebeu nenhuma das interfaces requeridas e nenhum evento esta sendo escutado ou emitido pelo componente. Portanto, é nessa etapa que devemos adicionar alguns métodos ao nosso componente.

```js
var MyFirstComponent;
MyFirstComponent = new Component('http://my-awsome-domain.com/my-first-component.js');
MyFirstComponent.install(function () {
    this.sayHello = function () {
        alert('Hello!');
    };
});
```

Agora precisamos apresentar a mensagem para o usuário, para fazer isso, devemos olhar o ciclo de start. No ciclo de start, conforme veremos mais a frente, o componente já esta pronto para ser usado, todas as interfaces foram fornecidas todos os eventos já estão sendo escutados e todos os métodos ja foram adicionados. Portanto, é nessa etapa que devemos iniciar o comportamento do componente.

```js
var MyFirstComponent;
MyFirstComponent = new Component('http://my-awsome-domain.com/my-first-component.js');
MyFirstComponent.install(function () {
    this.sayHello = function () {
        alert('Hello!');
    };
});
MyFirstComponent.start(function () {
    this.sayHello();
});
```

### Manipulando graficamente
Todo componente recebe no ciclo de install uma referência para a tag HTML que o chamou. Essa tag é o escopo de aplicação do componente e é nela que devemos colocar a UI do componente.

```js
var MyFirstComponent;
MyFirstComponent = new Component('http://my-awsome-domain.com/my-first-component.js');
MyFirstComponent.install(function (element) {
    this.html = function (val) {
        if (val) { element.innerHTML = val; }
        return element.innerHTML;
    };
});
MyFirstComponent.start(function () {
    this.html('ola!');
});
```

Vale notar que o objeto element é um objeto do DOM e portanto implementa toda a API de HTMLElementPrototype com métodos como appendChild, innerHTML, etc...

### Herança de componentes
Todo componente pode ser extendido, e um componente pode extender multiplos componentes distintos, para extender um componente devemos utilizar o método extend passando a URI do componente que desejamos extender. Um ponto importante é que os componentes herdeiros do componente original vão rodar o ciclo de install do componente pai, contudo, não vão rodar o ciclo de start do pai.

Por exemplo, vamos supor que desejamos extender o MyFirstComponent criando um novo componente MyAwsomeComponent.

```js
var MyAwsomeComponent;
MyAwsomeComponent = new Component('http://my-awsome-domain.com/my-awsome-component.js');
MyAwsomeComponent.extend('http://my-awsome-domain.com/my-first-component.js');
MyAwsomeComponent.install(function () {
    this.fizz = function () {
        this.html('fizz');
    };
    
    this.buz = function () {
        this.html('buz');
    };
});
MyAwsomeComponent.start(function () {
    this.fizz();
});
```
Note que como MyAwsomeComponent extende MyFirstComponent o método html esta acessível.



