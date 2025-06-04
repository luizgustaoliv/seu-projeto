const { createUserSchema, updateUserSchema, loginSchema } = require('../models/UserModel');

describe('UserModel', () => {
    describe('createUserSchema', () => {
        it('deve validar um objeto de usuário válido', () => {
            const validUser = {
                nome: 'Usuário Teste',
                email: 'teste@email.com',
                senha: '123456'
            };

            const { error } = createUserSchema.validate(validUser);
            expect(error).toBeUndefined();
        });

        it('deve rejeitar um objeto de usuário sem nome', () => {
            const invalidUser = {
                email: 'teste@email.com',
                senha: '123456'
            };

            const { error } = createUserSchema.validate(invalidUser);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('nome');
        });

        it('deve rejeitar um email inválido', () => {
            const invalidUser = {
                nome: 'Usuário Teste',
                email: 'email_invalido',
                senha: '123456'
            };

            const { error } = createUserSchema.validate(invalidUser);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('email');
        });

        it('deve rejeitar uma senha muito curta', () => {
            const invalidUser = {
                nome: 'Usuário Teste',
                email: 'teste@email.com',
                senha: '12345'
            };

            const { error } = createUserSchema.validate(invalidUser);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('senha');
        });
    });

    describe('updateUserSchema', () => {
        it('deve validar uma atualização válida', () => {
            const validUpdate = {
                nome: 'Nome Atualizado',
                email: 'novo@email.com'
            };

            const { error } = updateUserSchema.validate(validUpdate);
            expect(error).toBeUndefined();
        });

        it('deve rejeitar uma atualização sem campos', () => {
            const invalidUpdate = {};

            const { error } = updateUserSchema.validate(invalidUpdate);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('pelo menos um campo');
        });

        it('deve rejeitar um email inválido na atualização', () => {
            const invalidUpdate = {
                email: 'email_invalido'
            };

            const { error } = updateUserSchema.validate(invalidUpdate);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('email');
        });
    });

    describe('loginSchema', () => {
        it('deve validar credenciais válidas', () => {
            const validCredentials = {
                email: 'teste@email.com',
                senha: '123456'
            };

            const { error } = loginSchema.validate(validCredentials);
            expect(error).toBeUndefined();
        });

        it('deve rejeitar credenciais sem email', () => {
            const invalidCredentials = {
                senha: '123456'
            };

            const { error } = loginSchema.validate(invalidCredentials);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('email');
        });

        it('deve rejeitar credenciais sem senha', () => {
            const invalidCredentials = {
                email: 'teste@email.com'
            };

            const { error } = loginSchema.validate(invalidCredentials);
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('senha');
        });
    });
}); 