const { createTaskSchema, updateTaskSchema } = require('../models/TaskModel');

describe('TaskModel', () => {
    describe('createTaskSchema', () => {
        it('deve validar um objeto de tarefa válido', () => {
            const validTask = {
                nome: 'Tarefa de teste',
                descricao: 'Descrição da tarefa',
                status: 'pendente'
            };

            const { error } = createTaskSchema.validate(validTask);
            expect(error).toBeUndefined();
        });

        it('deve rejeitar um objeto de tarefa sem nome', () => {
            const invalidTask = {
                descricao: 'Descrição da tarefa',
                status: 'pendente'
            };

            const { error } = createTaskSchema.validate(invalidTask);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('nome');
        });

        it('deve rejeitar um nome muito longo', () => {
            const invalidTask = {
                nome: 'a'.repeat(256),
                descricao: 'Descrição da tarefa',
                status: 'pendente'
            };

            const { error } = createTaskSchema.validate(invalidTask);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('255 caracteres');
        });
    });

    describe('updateTaskSchema', () => {
        it('deve validar uma atualização válida', () => {
            const validUpdate = {
                nome: 'Tarefa atualizada',
                status: 'concluida'
            };

            const { error } = updateTaskSchema.validate(validUpdate);
            expect(error).toBeUndefined();
        });

        it('deve rejeitar uma atualização sem campos', () => {
            const invalidUpdate = {};

            const { error } = updateTaskSchema.validate(invalidUpdate);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('pelo menos um campo');
        });

        it('deve rejeitar um status inválido', () => {
            const invalidUpdate = {
                status: 'status_invalido'
            };

            const { error } = updateTaskSchema.validate(invalidUpdate);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('status');
        });
    });
}); 