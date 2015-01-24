HTML Template Project
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
```


Configuração inicial
======

Antes de tudo, você precisará configurar o arquivo `project-config.json`:

```
"title": "Título do projeto" // Substitui {{{site_title}}} do conteúdo da tag <title>{{{site_title}}}</title> nas páginas que não possuem título próprio.
"jslint": {
    "mainEnabled": false // Adiciona ou remove o main.js no jslint
},
"uglify": { // Quando o comando " $ grunt production" é utilizado, esses comandos não são respeitados, ficando false, true, true
    "beautify": true, // Quando true, identa o main.min.js
    "sourceMap": true, // Quando true, cria o *. file para leitura do console do browser
    "dropConsole": false, // Quando true, remove todo e qualquer console.log do build do main.min.js
    "files": { // Ao invés de modificar o Gruntfile, você pode editar a lista de arquivos por aqui mesmo.
        "deploy/assets/scripts/main.min.js": [
            "sources/assets/scripts/main.js",
            "sources/assets/scripts/**/*.js",
            "!sources/assets/scripts/plugins/**/*.js"
        ]
    }
},
"stylus": { // Quando o comando " $ grunt production" é utilizado, esses comandos não são respeitados, ficando true
    "compress": false, // Quando true, comprime o main.min.css
    "files": { // Ao invés de modificar o Gruntfile, você pode editar a lista de arquivos por aqui mesmo.
        "deploy/assets/css/main.min.css": ["sources/assets/css/main.styl"]
    }
},
"urls": {
    "basePathLocal": "http://localhost/html-template-project/deploy", // Basepath utilizado por padrão para o comando "$ grunt deploy"
    "baseUrlProduction": "http://cdn.html-template-project.com.br" // Item obrigatório, pois essa url é utilizada para comparação para decidir qual Omniture Account utilizar, a de testes ou a de produção.
},
"sprites": { // Adiciona esse objeto a task de sprites, para não precisar alterar o Gruntfile.js
    "spritesheet": {
        "src": "sources/assets/images/spritesheet/*.png", // pasta onde se encontram os pngs que formarão o sprite
        "destImg": "deploy/assets/images/spritesheet.png", // Destino do sprite gerado
        "destCSS": "sources/assets/css/spritesheet.styl", // Destino do Stylus gerado
        "cssTemplate": "sources/assets/css/spritesheet.styl.tpl", // Template do Stylus
        "padding": 10, // Espaço entre as imagens no sprite
        "algorithm": "binary-tree", // Decide a disposição das imagens dentro do sprite: https://github.com/Ensighten/spritesmith#available-packing-algorithms
        "imgPath": "CDN_BASEPATH/assets/images/spritesheet.png" // Path que será utilizado dentro do Stylus
    }
},
"toApplyTemplate": [ // Lista de arquivos que receberão o template
    {
        "title": "Título da página", // Substitui {{{site_title}}} do conteúdo da tag <title>{{{site_title}}}</title> na página em questão.
        "file": "index.html", // Arquivo que receberá o template, com url relativa ao seguinte caminho: "sources/site/"
        "replace": [ // Array de objetos informando o que precisará ser substituído na página
            {
                "find": "item-1", // Será procurado {{{item-i}}} na página ...
                "replace": "Nome do item 1" // ... e será substituído por "Nome do item 1".
            }
        ]
    }
],
"templateFiles": [ // Lista de arquivos que são utilizados para gerar o template e aplicar nos arquivos selecionados (No array toApplyTemplate) do site.
    "sources/site/_head-declarations.html",
    "sources/site/_footer-declarations.html"
]
```

Estrutura de arquivos
======
```
deploy
---// Arquivos necessários para rodar o site.
---// Essa pasta está inclusa no .gitignore, pois não há necessidade de versionamento.
sources
---assets
------css
---------fonts.styl
---------main.styl // Css principal
---------spritesheet.styl // Gerado pelo spritesmith
---------spritesheet.styl.styl // Template para gerar o spritesheet.styl
---------variables.styl
------fonts
---------// Todos arquivos de font necessários para rodar o site
------images
---------spritesheet // Todos arquivos .png que geram o arquivo assets/images/spritesheet.png. Configurável no project-config.json:sprites
------scripts
---------plugins
------------// Todo e qualquer js que deve ser declarado antes do main
------------youtube-player.js // Script responsável pelo player de vídeo do youtube. Mais informações abaixo.
---------main.js // Js principal
---site
------_footer-declarations.html // Arquivo aplicado no footer que contém declarações necessárias para o projeto.
------_head-declarations.html // Arquivo aplicado no head que contém declarações necessárias para o projeto.
------index.html
------// Quaisquer outras pastas ou arquivos html, json, ou do tipo, necessários para o site
```


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
