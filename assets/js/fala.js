// Voz dos jogos: usa a leitura em voz alta do próprio aparelho (gratuita, offline).
(function () {
  const sintese = window.speechSynthesis;
  let voz = null;

  function escolherVoz() {
    if (!sintese) return;
    const vozes = sintese.getVoices();
    voz =
      vozes.find((v) => v.lang === "pt-BR" && /female|francisca|luciana|maria/i.test(v.name)) ||
      vozes.find((v) => v.lang === "pt-BR") ||
      vozes.find((v) => v.lang && v.lang.startsWith("pt")) ||
      null;
  }

  if (sintese) {
    escolherVoz();
    sintese.onvoiceschanged = escolherVoz;
  }

  window.falar = function (texto, aoTerminar) {
    // Garante que o jogo continua mesmo se o aparelho não tiver voz
    // ou se o navegador não avisar o fim da fala.
    let terminou = false;
    const terminar = () => {
      if (terminou) return;
      terminou = true;
      if (aoTerminar) aoTerminar();
    };
    const limite = Math.max(1800, texto.length * 110);

    if (!sintese) {
      setTimeout(terminar, 600);
      return;
    }
    sintese.cancel();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    if (voz) fala.voice = voz;
    fala.rate = 0.85;
    fala.pitch = 1.15;
    fala.onend = terminar;
    fala.onerror = terminar;
    sintese.speak(fala);
    setTimeout(terminar, limite);
  };

  // Para a voz soar como o nome/som da letra, não como a letra isolada.
  window.SOM_LETRA = { A: "á", E: "é", I: "i", O: "ó", U: "u", M: "ême" };
})();
