import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const TokenUserName = 'username'

// token
export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

// 用户名
export function getCookiesUserName() {
    return Cookies.get(TokenUserName)
}

export function setCookiesUserName(username) {
    return Cookies.set(TokenUserName, username)
}

export function removeCookiesUserName() {
    return Cookies.remove(TokenUserName)
}
