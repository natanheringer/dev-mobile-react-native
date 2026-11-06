/***

    Define a interface que representa o funcionario no Typescript
    para garantir a tipagem estatica.

*/

import type { Timestamp } from "firebase/firestore";

export interface Funcionario {

    id?:        string;
    nome:       string;
    email:      string;
    cargo?:     string;
    criadoEm?:  Timestamp | null;
    editadoEm?: Timestamp | null;

    /*** true enquanto o servidor nao confirmou a gravacao. Nao vai para o banco. */
    pendente?:  boolean;

}

/*** Campos que o formulario envia: sem id e sem datas (o servidor as grava). */
export type NovoFuncionario = Omit<Funcionario, "id" | "criadoEm" | "editadoEm" | "pendente">;

/*** Em uma edicao, qualquer campo do formulario pode vir ou nao. */
export type FuncionarioAlteracao = Partial<NovoFuncionario>;
