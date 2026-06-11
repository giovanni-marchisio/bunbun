// Não sei se iria ficar legal criar arquivo separado para cada tipo de erro...

export class AppError extends Error {
    constructor(
        public override message: string,
        public status: number = 400
    ) {
        super(message)
    };
};

export class NotFoundError extends AppError {
    constructor(message = 'Recurso não encontrado!') {
        super(message, 404)
    };
};

export class UnauthorizedError extends AppError {
    constructor(message = 'não autorizado!') {
        super(message, 401)
    };
};

export class ConflictError extends AppError {
    constructor(message = 'Recurso já existe!') {
        super(message, 409)
    };
};