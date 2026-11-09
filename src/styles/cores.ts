/***
    Paleta Editorial & Utilitária (Referência: Stripe / Square 2014 SOTA High-Tier).
    Foco em tipografia rigorosa, escala de cinzas precisa, linhas de 1px e ausência
    de ornamentos desnecessários (anti-slop).
*/

export const cores = {
    // Escala Primária Monocromática
    preto:           '#0D0F12', // Ônix profundo para cabeçalhos e botões principais
    grafite:         '#1F242F', // Superfícies escuras
    fundo:           '#F4F5F7', // Fundo cinza suíço clássico (iOS 8 / Stripe 2014)
    superficie:      '#FFFFFF', // Fundo de cartões e tabelas
    superficieAlt:   '#F8F9FA', // Fundo de seções secundárias

    // Tipografia
    texto:           '#101828', // Texto principal preto de alto contraste
    textoSecundario: '#475467', // Subtítulos e dados de apoio
    textoMudo:       '#98A2B3', // Labels com tracking e placeholders
    textoInvertido:  '#FFFFFF',

    // Compatibilidade
    textoFraco:      '#475467',
    textoApagado:    '#98A2B3',

    // Bordas e Divisores (Hairlines de precisão)
    borda:           '#E4E7EC', // Borda padrão 1px
    bordaFina:       '#EAECF0', // Divisor sutil entre linhas de tabela
    bordaLeve:       '#EAECF0',
    bordaAtiva:      '#101828', // Borda com foco

    // Indicadores de Estado Pontuais (apenas pontos de 6px ou textos técnicos)
    sucesso:         '#039855', // Verde esmeralda de produção
    aviso:           '#DC6803', // Âmbar para pendências de rede
    erro:            '#D92D20', // Vermelho para exclusões e falhas
    azul:            '#175CD3', // Azul técnico corporativo
} as const;
