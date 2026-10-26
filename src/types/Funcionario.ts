/*** 
 
    Define a interface que representa o funcionario no Typescript
    para garantir a tipagem estatica

*/


export interface Funcionario {

    id?:       string; 
    nome:      string;
    email:     string;
    criadoEm?: any;

}

