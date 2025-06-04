const { createCategorySchema, updateCategorySchema } = require('../models/CategoryModel');

describe('CategoryModel', () => {
    describe('createCategorySchema', () => {
        it('deve validar um objeto de categoria válido', () => {
            const validCategory = {
                nome: 'Categoria Teste',
                descricao: 'Descrição da categoria',
                cor: '#FF0000'
            };

            const { error } = createCategorySchema.validate(validCategory);
            expect(error).toBeUndefined();
        });

        it('deve rejeitar um objeto de categoria sem nome', () => {
            const invalidCategory = {
                descricao: 'Descrição da categoria',
                cor: '#FF0000'
            };

            const { error } = createCategorySchema.validate(invalidCategory);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('nome');
        });

        it('deve rejeitar um nome muito longo', () => {
            const invalidCategory = {
                nome: 'a'.repeat(256),
                descricao: 'Descrição da categoria',
                cor: '#FF0000'
            };

            const { error } = createCategorySchema.validate(invalidCategory);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('255 caracteres');
        });

        it('deve rejeitar uma cor inválida', () => {
            const invalidCategory = {
                nome: 'Categoria Teste',
                descricao: 'Descrição da categoria',
                cor: 'vermelho'
            };

            const { error } = createCategorySchema.validate(invalidCategory);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('cor');
        });
    });

    describe('updateCategorySchema', () => {
        it('deve validar uma atualização válida', () => {
            const validUpdate = {
                nome: 'Categoria Atualizada',
                cor: '#00FF00'
            };

            const { error } = updateCategorySchema.validate(validUpdate);
            expect(error).toBeUndefined();
        });

        it('deve rejeitar uma atualização sem campos', () => {
            const invalidUpdate = {};

            const { error } = updateCategorySchema.validate(invalidUpdate);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('pelo menos um campo');
        });

        it('deve rejeitar uma cor inválida na atualização', () => {
            const invalidUpdate = {
                cor: 'verde'
            };

            const { error } = updateCategorySchema.validate(invalidUpdate);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('cor');
        });
    });
}); 