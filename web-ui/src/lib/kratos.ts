import { Configuration, FrontendApi } from "@ory/client"

export const kratos = new FrontendApi(
    new Configuration({
        basePath: import.meta.env.VITE_AUTH_URL || "http://localhost:4455/auth",
        baseOptions: {
            withCredentials: true
        }
    })
)
