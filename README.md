Polaco Jam

We are developing to [GGJ 2015](http://globalgamejam.org/).

===

Dependências do Template
========


#####Nodejs - [Referencia](http://nodejs.org/)

Faça download do pacote no [site](http://nodejs.org/download)

ou se preferir instale via homebrew, caso o tenha (mac)
```
$ brew install node
```

#####Grunt - [Referencia](http://gruntjs.com/getting-started)

Com o node instalado execute este comando
```
$ npm install -g grunt-cli
```

Na raiz do projeto, instale as dependencias do grunt com este comando
```
$ npm install


Grunt
======

Não deve haver necessidade de alterar o arquivo `Gruntfile.js`.
Para isso existe o `project-config.json`, explicado acima.

Descrição dos processos do Grunt:

O `watch` atualiza a pasta `deploy` utilizando o basepath `urls.basePathLocal` setado no arquivo `project-config.json`.
Os arquivos fontes estão na pasta `sources`.
```
$ grunt w
```


Você pode gerar o projeto para vários ambientes adicionando o basepath.
```
$ grunt deploy // caso não seja setado nenhum basepath, o comando utiliza o basepath `urls.basePathLocal` setado no arquivo `project-config.json`
$ grunt deploy:http://localhost/html-template-project/deploy
```


Caso você precise utilizar o ip da sua máquina para gerar uma versão, utilize o seguinte comando:
```
$ grunt my-ip
```
... e acesse http://seu-ip/html-template-project/deploy/


Para deploy em homologação/produção, é necessário rodar o seguinte comando:
```
$ grunt production:http://www.html-template-project.com.br
```

Após, é só comitar.



Vídeos
======

Seguindo a API JS do YouTube: https://developers.google.com/youtube/iframe_api_reference?hl=pt-BR

Para inserir YouTube vídeo, foi desenvolvido o método `$.youtubeVideoPlayer();`.

Instruções:

- Insira no html a seguinte tag:
```
<div class="class-customizada-do-player" video-id="Hnd_5P1eXHg" video-show-mosaic="0" video-show-controls="0" video-show-info="0" video-auto-play="1" video-mute="1" video-loop="1"></div>
```

- Algumas coisas podem ser configuradas na própria tag:
`video-show-mosaic: 1/0` Mostra ou não o mosaico de vídeos relacionados.
`video-show-controls: 1/0` Mostra ou não os controles como play/pause, barra de progresso, volume, etc...
`video-show-info: 1/0` Mostra ou não a barra superior com informações do vídeo como título.
`video-auto-play: 1/0` Ativa o autoplay do vídeo.
`video-mute: 1/0` Ativa ou não o mute do vídeo. Na real o que esse parâmetro faz é deixar o volume 0% ou 100%.
`video-loop: 1/0` Ativa o loop. Na real o que esse parâmetro faz é dar play novamente quando o vídeo chega ao final.

Somente o parâmetro `video-id` é obrigatório.

- Chamada do JS:
```
$('.class-customizada-do-player').youtubeVideoPlayer();
```

- Caso haja a necessidade de saber quando o vídeo termina:
```
$('.class-customizada-do-player').youtubeVideoPlayer({onFinished:function(){
  alert('Fim do vídeo.');
}});
```

- O vídeo também chama um callback de `onUpdate` a cada 50 milisegundos.
```
$('.class-customizada-do-player').youtubeVideoPlayer({onUpdate:function(player){
  console.log('Segundo atual: ' + player.getCurrentTime() + ' | Tempo total do vídeo: ' + player.getDuration());
}});
```

- Caso haja a necessidade de controlar o player com os métodos da API do YouTube pelo console, você precisará somente o ID do vídeo.
Segue o exemplo abaixo:
```
window['video' + 'Hnd_5P1eXHg'.toLowerCase() + '-api'].content.player.playVideo();
```
Esse método de debug funciona com todos os recursos que a API do YouTube disponibiliza.
