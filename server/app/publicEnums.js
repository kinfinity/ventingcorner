const VC_STATES = {
    REQUEST_OK: "smooth sailing",
    REQUEST_ERROR: "",
    AUTHENTICATION_ERROR: "authentication_error",
    INVALID_REQUEST_ERROR: "invalid_request_error",
    INTERNAL_SERVER_ERROR: "internal_server_error",
    CSRF_ERROR: "csrf_error",
    HASHING_ERROR: "hashing_error",
    EMPTY_TOKEN: "empty_token",
    INVALID_TOKEN: "invalid_token",
    UNAUTHORISED:"unauthorised_access",
    INVALID_RESOURCE: "invalid_resource",
    RESOURCE_EXISTS: "resource already exists"
}


const VC_STATUS_CODES = {
    REQUEST_OK: 200,
    REQUEST_ERROR: 400,
    UNAUTHORISED: 401,
    REQUEST_FAILED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
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
    VC_STATES,
    VC_STATUS_CODES,
    VC_STATUS_MESSAGES
}