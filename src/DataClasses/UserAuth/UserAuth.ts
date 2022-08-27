export interface IUserAuth {
    version: string,
    userId: string,
    email: string,
    phone: string
}

export class UserAuth {
    version: string
    userId: string
    email: string
    phone: string
    constructor (userId: string,
                 email: string,
                 version: string = '1.0.1',
                 phone: string = '000 000-0000') {
        if (!UserAuth.isValidUserId(userId)) {throw new Error('Bad user id!')}
        if (!UserAuth.isValidEmail(email)) {throw new Error('Bad email!')}
        if (!UserAuth.isValidVersion(version)) {throw new Error('Bad version!')}
        this.version = version
        this.userId = userId
        this.email = email
        this.phone = phone
    }
    static isValidVersion(version: string) {
        if (version === ''){
            return false
        }
        return true
    }
    static isValidUserId(userId: string) {
        if (userId === ''){
            return false
        }
        return true
    }
    static isValidEmail(email: string) {
        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            return false
        }
        return true
    }
    static isValidPhone(phone: string) {
        if (!phone.match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/)){
            return false
        }
        return true
    }
}

export const userAuthConverter = {
    toFirestore: (userAuth: UserAuth) => {
        return {
            version: userAuth.version,
            userId: userAuth.userId,
            email: userAuth.email,
            phone: userAuth.phone
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        return new UserAuth(data.version, data.userId, data.email, data.phone)
    }
}