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

### Emitindo e escutando eventos de outros componentes
Todo componente pode emitir e escutar eventos de outros componentes. Por exemplo, vamos supor que desejamos ter um componente timer que fica a cada segundo emitindo um sinal de tick e um couter que toda vez que recebe um sinal de tick incrementa um contador.

```js
var Timer;
Timer = new Component('./timer.js');
Timer.publish('tickEvent');
Timer.install(function (element) {
    this.tick = function () {
        this.tickEvent();
        element.innerHTML = element.innerHTML === '-' ? '|' : '-';
    };
});
Timer.start(function () {
    setInterval(this.tick.bind(this), 1000);
});
```

Note que ao informar que o timer emite um evento tickEvent automaticamente, um método tickEvent é adicionado ao componente que quando chamado dispara o evento. Lembres-e no ciclo de install esse método ainda não foi adicionado ao componente e portanto o evento não pode ser emitido, apenas após o ciclo de install isso pode ocorrer, por isso, apenas no start o tick é chamado.

```js
var Counter;
Counter = new Component('./counter.js');
Counter.listen('tickEvent', function () {
    this.add();
});
Counter.install(function (element) {
    var counted = 0;

    this.add = function () {
        counted += 1;
        element.innerHTML = counted.toString();
    };
});
```

Note que para informar que o componente escuta um evento tickEvent, devemos utilizar o método listen. No callback do evento, o componente ja passou pelos ciclos de install e start e portanto, o componente ja está montado e pronto para uso.

Após criados os componentes, devemos instancia-los e ligar as instancias para escutarem os eventos das instâncias corretas.

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script type="text/javascript" src="./components.min.js"></script>
</head>
<body>
    <component type="./timer.js" id="timerInstance"></component>
    <component type="./counter.js" id="counterInstance" tickEvent="timerInstance"></component>
</body>
</html>
``` 

### Requisitando e provendo interfaces
Todo componente pode prover e requisitar interfaces. Por exemplo, vamos supor que desejamos ter um componente car que desenha na tela um carro, contudo, para desenhar o carro, devemos saber a sua posição e para saber a posição do carro, precisamos saber o tempo transcorrido. Portanto, o componente car vai requerer uma interface watchInterface que retorna o tempo e vamos implementar um componente watch que irá prover essa interface.

```js
var Watch;
Watch = new Component('./watch.js');
Watch.provide('watchInterface', function () {
    return {
        'hours'   : this.tick,
        'minutes' : this.minutes,
        'seconds' : this.seconds
    };
});
Watch.install(function (element) {
    this.hours = function () {
        return new Date().getHours();
    };
    
    this.minutes = function () {
        return new Date().getMinutes();
    };
    
    this.seconds = function () {
        return new Date().getSeconds();
    };
});
```
Note que o provide recebe uma função que constrói a interface provida, essa função, é executada no contexto do componente e só é executada após o ciclo de install.

```js
var Car;
Car = new Component('./car.js');
Car.require('watchInterface', function (watch) {
    this.watch = watch;
});
```
Note que o require recebe a interface requerida no callback passado. O contexto de execução do callback é o do componente, portanto, podemos adicionar ao objeto a interface requerida como um atributo para uso posterior.

Após criados os componentes, devemos instancia-los e ligar as instancias para proverem as interfaces.

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script type="text/javascript" src="./components.min.js"></script>
</head>
<body>
    <component type="./watch.js" id="watchInstance"></component>
    <component type="./car.js" id="carInstance" watchInterface="watchInstance"></component>
</body>
</html>
```
