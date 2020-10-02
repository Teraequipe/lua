# LUA
A Lua é a primeira bot de discord da Equipe Tera! Ela é desenvolvida com o intuito de auxiliar os membros em tarefas diárias e promover um ambiente virtual mais aconchegante para todos, fique a vontade em sugerir e colaborar conosco!

## Database
* Instalai SQLite `npm install sqlite3`;
* Criei um arquivo `database.sqlite`;
* Instalei o Keyv `npm install keyv`;
* Segui o guia no Discord.js e a documentação do Keyv;


## Debug
* Existe um erro específico que tem um tratamento no guia do [Discord.js](https://discordjs.guide/popular-topics/miscellaneous-examples.html#catching-unhandledpromiserejectionwarnings) que é o erro `UnhandledPromiseRejectionWarnings`;

## Deploy
### Heroku 
    O heroku possui um pacote gratuito para estudantes com o email institucional e não necessita de registro de cartão de crédito para começar a utilizar os pacotes gratuitos.

#### Instalação
    Como até o momento está sendo utilizado o node para o desenvolvimento do bot, é mais fácil utilizar o comando `npm install heroku -g` para instalar o heroku globalmente.

#### Utilização 
Usar o heruko é muito simples, porém, para aplicações que não são web, algumas mudanças devem ser efetuadas pois o heroku tem procedimentos padrões para web que não são necessárias e inclusive acabam causando erros no bot.

Para começar, é necessário criar uma pasta com o nome "Procfile". O nome deve ser escrito exatamente dessa forma, letra por letra e sem extensão (.txt por exemplo) pois, caso contrário, o heroku não respeita o arquivo e o ignora. Nesse arquivo escreva `worker: node index.js` (considerando que o arquivo index.js seja onde o seu bot inicia) e salve. Esse arquivo serve para substituir o formato web que causará erros, como explicado.

Após isso, inicializa-se o git com o comando `git init` caso o projeto já esteja em execução (partirei do presuposto que o git já está instalado na sua maquina e o cadastro já foi efetuado). Se o projeto foi iniciado no heroku e ainda não há um repositório dele é possível clonar o projeto. Digite `git add -A` para adicionar todos os arquivos no repositório para o git. Dê commit com `git commit -m "Procfile"` e dê push com `git push heroku master`.

Se digitar heroku ps, é possível perceber que a aplicação está em prossedimento web. Para trocar isto, basta executar o comando `heroku ps:scale worker=1` para iniciar um dyno worker e depois executar `heroku ps:scale web=0` para excluir o dyno web.

Se todos os passos tiverem sido efetuados corretamente, agora o bot estará rodando nos servidores heroku.

#### Debug heroku
* `Error R10 (Boot timeout)`: esse erro ocorre pois a mudança de web para worker não foi efetuada e o heroku está tentando efetuar protocolos web no bot. Siga os passos descritos na 'utilização' acima.
* Tirar o [dyno web](https://stackoverflow.com/a/35542473) e estabelecer o [worker](https://devcenter.heroku.com/articles/procfile#scaling-a-process-type).
* Quando o Procfile for escrito da forma errada e o git não muda mesmo commitando as mudanças novamente é só seguir essa [solução do stackoverflow](https://stackoverflow.com/a/63344513).