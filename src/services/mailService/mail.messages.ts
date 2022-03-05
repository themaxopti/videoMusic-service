export const confirmAccountMessage = (link, to) => {
    return `
    Здравствуйте, ${to} ,пожалуйста, подтвердите свой аккаунт.
    Письмо для подтверждения аккаунта:<br />
    <a href="${link}">${link}</a>      
    `
}