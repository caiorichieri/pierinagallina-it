/**
 * CONFIGURAÇÃO DA FOTO DO HERO
 *
 * Use este arquivo para ajustar a posição e o tamanho da foto da Pierina
 * na página inicial, sem precisar mexer em CSS.
 *
 * As alterações são aplicadas automaticamente ao salvar.
 */

export const HERO_PHOTO = {
  /**
   * Configurações para CELULAR (mobile)
   */
  mobile: {
    // Sobe ou desce a foto em relação aos botões.
    // Valor negativo sobe; positivo desce.
    // Ex: "-2rem" sobe um pouco, "-4rem" sobe mais.
    offsetY: "-2rem",

    // Aumenta ou diminui a foto.
    // 1 = tamanho original. 1.15 = 15% maior. 0.8 = 20% menor.
    scale: 1.15,

    // Altura reservada para a foto no celular.
    // Aumente se a foto parecer cortada ou se quiser uma seção mais alta.
    height: "30rem",

    // Define qual parte da imagem fica visível.
    // O primeiro valor (X%) move horizontalmente: 0% esquerda, 50% centro, 100% direita.
    // O segundo valor (Y%) move verticalmente: 0% topo, 100% base.
    // Como a Pierina está no centro/superior da imagem, "50% 12%" foca no rosto.
    objectPosition: "50% 12%",
  },

  /**
   * Configurações para COMPUTADOR (desktop)
   */
  desktop: {
    // Posição vertical: negativo sobe, positivo desce.
    offsetY: "-0.5rem",

    // Empurra a foto para a direita (afastando do texto).
    // Ex: "2cm", "3cm", "100px".
    translateX: "3cm",

    // Tamanho da foto no desktop.
    scale: 1.7,

    // Foca no rosto da Pierina (centro/superior da imagem).
    objectPosition: "50% 12%",
  },
};
