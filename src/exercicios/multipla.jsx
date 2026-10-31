// tipo de exercicio = multipla escolha

// Cada tipo de exericcio deve ter estes campos para ser exportado como um objeto
//  -Campo          : Componente React que mostra o campo de reposta
//  -verificar:     : confere se a resposta esta certa
//  -respotaInicial : o valor "vazio" quando abre a questao
//  -temResposta    : valida se pode habilitar o botao "verificar"

// Dados que se espera no exercicio : opcoes de resposta (array) e indice da respsota certa

// Quando o usuario acerta (acertou === true), a opcao correta fica verde e as demais vermelhas
// ao errar, nada deve ocorrer, assim não revela a resposta (estava acontecendo isso nos testes)


// funcao que deixa as opcoes coloridas ao acertar
export function corDaOpcao (acertou, ehorreta) {
    if (!acertou) return undefined
    return ehorreta ? 'green' : 'crimson'
    // green = verde - crimson = vermelho escuro
}

// funcao que extrutura o campo das respsotas do exercicio
// qual a origem destes parametros dentreo do Campo?
function Campo({exercicio, resposta, setResposta, travado, acertou}) {
    return (
        // trava a opcao de responder o exercicio até ter algo selecioado
        <fieldset disabled={travado}> 
            {exercicio.opcoes.map((opcao, i) => {
                const ehCorreta = i === exercicio.correta 
                return (
                    <label
                    // cuidada pra que esteja na cor certa
                        key = {i}
                        style={{
                            display:'block',
                            color: corDaOpcao(acertou, ehCorreta),
                            fontWeight: acertou && ehCorreta ? 'bold' : 'normal',
                        
                        }}
                    >
                        <input
                            type='radio'
                            name={exercicio.id} //mesmo name q agrupa os radiso (so um marcado)
                            checked={resposta === i}
                            onChange={() => setResposta(i)}
            
                        />{' '}
                        {opcao}
                        {acertou && ehCorreta ? ' (correta)' : ''}
                        
                    </label>
                )
            })}
        </fieldset>
    )
}

//forma o exercicio na tela
export default {
    Campo,
    verificar: (exercicio, resposta) => resposta === exercicio.correta,
    respostaInicial: () => null, //começa com nada marcado
    temResposta: (exercicio,resposta) => resposta  !== null,
}