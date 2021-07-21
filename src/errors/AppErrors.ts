export default class AppErrors {
    public readonly message: String
    public readonly statusCode: number

    constructor(message: string, statusCode: number=400) {
        this.message = message
        this.statusCode = statusCode
    }
}