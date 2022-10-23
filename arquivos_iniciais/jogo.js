console.log('Seja bem-vindo meu amigo desenvolvedor');
console.log('Inscreva-se no canal :D https://www.youtube.com/channel/UCzR2u5RWXWjUh7CwLSvbitA');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = "#70c5ce"
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura
        )
        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            (this.x + this.largura), this.y,
            this.largura, this.altura
        )

    }
}

const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    desenha() {
        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura
        )
        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            (this.x + this.largura), this.y,
            this.largura, this.altura
        )
    }
}

const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula() {
        this.velocidade = - this.pulo
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
        this.velocidade += this.gravidade
        this.y += this.velocidade
    },
    desenha() {
        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY, // Sprite x, sprite y
            this.largura, this.altura, // tamanho do recorte na sprite
            this.x, this.y,
            this.largura, this.altura
        )
    }
}

const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            this.sX, this.sY,
            this.w, this.h,
            this.x, this.y,
            this.w, this.h
        )
    }
}

let telaAtiva = {}

function mudaParaTela(novaTela) {
    telaAtiva = novaTela
}

const telas = {
    INICIO: {
        desenha() {
            planoDeFundo.desenha()
            chao.desenha()
            flappyBird.desenha()
            mensagemGetReady.desenha()
        },
        click() {
            mudaParaTela(telas.JOGO)
        },
        atualiza() {

        }
    },
    JOGO: {
        desenha() {
            planoDeFundo.desenha()
            chao.desenha()
            flappyBird.desenha()
        },
        click() {
            flappyBird.pula()
        },
        atualiza() {
            flappyBird.atualiza()
        }
    }
}

function loop() {
    telaAtiva.desenha()
    telaAtiva.atualiza()

    requestAnimationFrame(loop)
}

window.addEventListener("click", () => {
    if (telaAtiva.click) {
        telaAtiva.click()
    }
})

mudaParaTela(telas.INICIO)

loop()