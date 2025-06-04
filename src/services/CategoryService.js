// services/CategoryService.js
const CategoryRepository = require("../repositories/CategoryRepository");
const { createCategorySchema, updateCategorySchema } = require("../models/CategoryModel");

class CategoryService {
    async createCategory(categoryData) {
        // 1. Validar dados de entrada
        const { error, value } = createCategorySchema.validate(categoryData);
        if (error) {
            const validationError = new Error(error.details.map(d => d.message).join(", "));
            validationError.statusCode = 400;
            throw validationError;
        }

        // 2. Verificar se a categoria já existe (pelo nome)
        const existingCategory = await CategoryRepository.getCategoryByName(value.nome);
        if (existingCategory) {
            const conflictError = new Error("Categoria com este nome já existe.");
            conflictError.statusCode = 409; // Conflict
            throw conflictError;
        }

        // 3. Chamar o repositório para criar a categoria
        try {
            const newCategory = await CategoryRepository.createCategory(value);
            return newCategory;
        } catch (err) {
            console.error("Erro no Service ao criar categoria:", err);
            throw new Error("Erro ao criar a categoria no banco de dados.");
        }
    }

    async getAllCategories() {
        try {
            const categories = await CategoryRepository.getAllCategories();
            return categories;
        } catch (err) {
            console.error("Erro no Service ao buscar todas as categorias:", err);
            throw new Error("Erro ao buscar categorias no banco de dados.");
        }
    }

    async getCategoryById(id) {
        if (isNaN(parseInt(id))) {
            const error = new Error("ID da categoria inválido.");
            error.statusCode = 400;
            throw error;
        }
        try {
            const category = await CategoryRepository.getCategoryById(id);
            if (!category) {
                const error = new Error("Categoria não encontrada.");
                error.statusCode = 404;
                throw error;
            }
            return category;
        } catch (err) {
            if (err.statusCode) throw err;
            console.error(`Erro no Service ao buscar categoria por ID ${id}:`, err);
            throw new Error("Erro ao buscar a categoria no banco de dados.");
        }
    }

    async updateCategory(id, categoryData) {
        if (isNaN(parseInt(id))) {
            const error = new Error("ID da categoria inválido.");
            error.statusCode = 400;
            throw error;
        }
        // No schema de update, apenas o nome é esperado/permitido por enquanto
        const { error, value } = updateCategorySchema.validate(categoryData);
        if (error) {
            const validationError = new Error(error.details.map(d => d.message).join(", "));
            validationError.statusCode = 400;
            throw validationError;
        }

        try {
            const existingCategoryById = await CategoryRepository.getCategoryById(id);
            if (!existingCategoryById) {
                const error = new Error("Categoria não encontrada para atualização.");
                error.statusCode = 404;
                throw error;
            }

            const existingCategoryByName = await CategoryRepository.getCategoryByName(value.nome);
            if (existingCategoryByName && existingCategoryByName.id !== parseInt(id)) {
                const conflictError = new Error("Já existe outra categoria com este nome.");
                conflictError.statusCode = 409; // Conflict
                throw conflictError;
            }

            const updatedCategory = await CategoryRepository.updateCategory(id, value);
            return updatedCategory;
        } catch (err) {
            if (err.statusCode) throw err;
            console.error(`Erro no Service ao atualizar categoria ${id}:`, err);
            throw new Error("Erro ao atualizar a categoria no banco de dados.");
        }
    }

    async deleteCategory(id) {
        if (isNaN(parseInt(id))) {
            const error = new Error("ID da categoria inválido.");
            error.statusCode = 400;
            throw error;
        }
        try {
            const deletedCategory = await CategoryRepository.deleteCategory(id);
            if (!deletedCategory) {
                const error = new Error("Categoria não encontrada para exclusão.");
                error.statusCode = 404;
                throw error;
            }
            return deletedCategory;
        } catch (err) {
             // Capturar erro de FK constraint se houver tarefas associadas
            if (err.code === '23503') {
                const fkError = new Error("Não é possível excluir a categoria pois ela está associada a tarefas existentes.");
                fkError.statusCode = 409;
                throw fkError;
            }
            if (err.statusCode) throw err;
            console.error(`Erro no Service ao deletar categoria ${id}:`, err);
            throw new Error("Erro ao deletar a categoria no banco de dados.");
        }
    }
}

module.exports = new CategoryService();
