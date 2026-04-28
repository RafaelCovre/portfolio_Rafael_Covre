# 🤖 Atividade: Engenharia de Instrução (Prompt Engineering)

## 📝 Descrição do Projeto
Este projeto foi desenvolvido como parte da disciplina de **Inteligência Artificial (2026.1)**. O objetivo foi dominar a técnica de comunicação com Modelos de Linguagem de Larga Escala (LLMs), atuando como **engenheiros de instrução** para obter resultados de alta precisão no menor tempo e com o menor número de interações possíveis.

O desafio consistiu em duas frentes:
1.  **Geração de Texto:** Criar um e-mail formal (e depois informal) de um pirata para um rei, com contextos específicos que evoluíram a cada iteração.
2.  **Geração de Imagem:** Criar um prompt complexo para gerar uma imagem 4k de um astronauta barroco em Marte.

**Integrantes do Trio:**
* RAFAEL SILVA COVRE BRAGANTE
* ITALO SANTOS
* JOSÉ RODRIGUES

## 🚀 Tecnologias Utilizadas
* **Modelo de IA:** Gemini 3 Flash (via interface de chat)
* **Ferramentas:** Engenharia de Prompt, Markdown
* **Plataforma de Registro:** GitHub

## 📊 Processo de Refinamento (Log de Iterações)

Abaixo, detalhamos o ciclo de **Avaliação e Integração** utilizado para atingir o "Alvo" em apenas 5 iterações.

### 📧 Desafio 1: O E-mail do Pirata

| Iteração | Prompt Enviado | Avaliação da Resposta |
| :--- | :--- | :--- |
| **1** | "gere um e-mail formal de desculpas de um pirata para um rei" | O e-mail ficou formal demais, sem nomes específicos. |
| **2** | "o pirata deve se chamar 'barba branca' e o rei deve se chamar 'arthur'" | Adicionou os nomes, mas o conteúdo ainda era genérico (sobre navio mercante). |
| **3** | "o pirata está se desculpando por ter sequestrado a princesa do rei" | Contexto corrigido, tom formal mantido. |
| **4** | "deixe num sotaque pirata, mais informal" | O tom mudou drasticamente para a "persona" correta, mas faltava o clímax. |
| **5** | "adicione no final que o navio está afundando e a princesa não sabe nadar" | **Resultado Final:** Alcançou o equilíbrio perfeito entre humor, urgência e sotaque. |

---

### 🎨 Desafio 2: A Imagem do Astronauta

![Astronauta Barroco em Marte](https://p7.itc.cn/images01/20201116/163ef2951717462c954e7d1887e07663.jpeg)
*Figura 1: Representação visual do astronauta barroco tocando violoncelo em chamas.*

**Prompt Final Utilizado:**
> "Realistic 4k photography of an astronaut in ornate Baroque-style armor, sitting on a chair and playing a cello that is engulfed in flames. The scene is set on the dusty red surface of Mars under a dark night sky filled with countless stars. A futuristic spacecraft is landed nearby in the background. High detail, cinematic lighting, dramatic shadows."

## 🔧 Resultados e Aprendizados
O projeto demonstrou que a precisão de uma IA depende diretamente da clareza e do contexto fornecido pelo humano.
* **Engenharia de Prompt:** Aprendemos que adicionar camadas de contexto (nomes, sotaques, urgência) é mais eficaz do que tentar explicar tudo em um único prompt gigante inicial.
* **Iteração Controlada:** O limite de 5 tentativas nos forçou a ser analíticos e a não desperdiçar comandos com instruções vagas.
* **Multimodalidade:** A transição entre gerar um texto criativo e uma imagem técnica exige a mudança de termos genéricos para termos descritivos (ex: "estilo barroco", "cinematic lighting").

---
[Voltar ao início(https://github.com/RafaelCovre/portfolio_Rafael_Covre)]
