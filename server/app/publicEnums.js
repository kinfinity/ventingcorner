const VC_STATUS_CODES = {
    REQUEST_OK: 200,
    REQUEST_ERROR: 101,
    SIGNUP_ERROR_USEREXISTS: 1011,
    LOGIN_ERROR: 1111,
    REQUEST_ERROR_FAILEDTOCREATE: 1012,
    REQUEST_ERROR_SCHOOLCODEMISMATCH: 1013,
    REQUEST_PARAM_ERROR: 102,
    NO_TOKEN: 1000,
    INCORRECT_TOKEN: 2222,
    INTERNAL_SERVER_ERROR: 103
}

const VC_STATUS_MESSAGES = {
    REQUEST_OK: "Smooth sailing",
    ASSERTION_ERR: "code Assertion Error, Check Logs",
    INTERNAL_SERVER_ERROR: "Error while processing request",
    CSRF_ERROR: "CSRF TOKEN tampered with",
    HASHING_ERROR: "Error while hashing password",
    INCORRECT_PARAMS: "incorrect parameters",
    INCORRECT_USERNAME: "username does not exist",
    SIGNUP_ERROR_USEREXISTS: "username already exists",
    SIGNUP_ERROR_EMAILEXISTS: "Email already signed up",
    INCORRECT_PASSWORD: "incorrect password",
    SUCCESSFUL_LOGIN: "Login: SUCCESS!",
    INCORRECT_TOKEN: "incorrect Token",
    EMPTY_TOKEN: "No Token present in header",
    EXPIRED_TOKEN: "Token Expired",
    REVOKED_TOKEN: "Revoked Token : Logged out",
    WRONG_ACCESS: "Aren't permitted to hit this endpoint",
    MAX_LOGINS_EXCEEDED: "maximum amount of Logins exceeded"

}

export default {
    VC_STATUS_CODES,
    VC_STATUS_MESSAGES
}